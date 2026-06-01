"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeritageDivider } from "@/components/heritage/HeritageDivider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { formatPrice } from "@/lib/utils";
import { Loader2, Check, CreditCard, Banknote } from "lucide-react";
import Link from "next/link";

const checkoutSchema = z.object({
  name:     z.string().min(2, "Name is required"),
  email:    z.string().email("Valid email required"),
  phone:    z.string().min(10, "Valid 10-digit phone required").max(10),
  line1:    z.string().min(5, "Address is required"),
  line2:    z.string().optional(),
  city:     z.string().min(2, "City is required"),
  state:    z.string().min(2, "State is required"),
  pincode:  z.string().length(6, "Valid 6-digit PIN required"),
  notes:    z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

interface CartItem {
  id: string;
  productId?: string;
  variantId?: string;
  name: string;
  variant?: string;
  price: number;
  quantity: number;
}

type PaymentMethod = "razorpay" | "cod";

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("razorpay");
  const [step, setStep]   = useState<"form" | "paying" | "success">("form");
  const [orderId, setOrderId] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("prakashco_cart");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.length > 0) {
          setCartItems(parsed);
        }
      } catch {
        setCartItems([]);
      }
    }
  }, []);

  // Map to checkout items structure
  const activeItems = cartItems.length > 0 ? cartItems.map(item => ({
    productId: item.productId || item.id,
    variantId: item.variantId || null,
    name: item.name,
    variant: item.variant || null,
    price: item.price,
    qty: item.quantity || 1
  })) : [
    { productId: "first-flush", variantId: null, name: "Darjeeling First Flush Tea (Demo)", variant: "250g", price: 450, qty: 1 },
    { productId: "honey-jam", variantId: null, name: "Himalayan Honey Jam (Demo)", variant: "350g", price: 280, qty: 2 }
  ];

  const subtotal   = activeItems.reduce((s, i) => s + i.price * i.qty, 0);
  const gst        = Math.round(subtotal * 0.05);
  const shipping   = subtotal > 500 ? 0 : 80;
  const total      = subtotal + gst + shipping;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutForm>({ resolver: zodResolver(checkoutSchema) });

  const onSubmit = async (data: CheckoutForm) => {
    if (paymentMethod === "razorpay") {
      await handleRazorpay(data);
    } else {
      await handleCOD(data);
    }
  };

  const handleRazorpay = async (data: CheckoutForm) => {
    setStep("paying");
    try {
      // 1. Create Razorpay order
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total, currency: "INR" }),
      });
      const { orderId: rzpOrderId } = await res.json();

      // 2. Open Razorpay checkout
      const options = {
        key:      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_51S1Prakash1928",
        amount:   total * 100,
        currency: "INR",
        name:     "A. Prakash & Co.",
        description: "Heritage Products Order",
        order_id: rzpOrderId,
        prefill:  { name: data.name, email: data.email, contact: data.phone },
        theme:    { color: "#0A9B4B" },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          // 3. Verify + create order in DB
          const verifyRes = await fetch("/api/razorpay/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...response, customer: data, items: activeItems, total }),
          });
          const { orderNumber } = await verifyRes.json();
          setOrderId(orderNumber);
          
          // Clear cart on success
          localStorage.removeItem("prakashco_cart");
          window.dispatchEvent(new Event("cart-updated"));
          
          setStep("success");
        },
      };
      // @ts-expect-error Razorpay is loaded via script
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      setStep("form");
      alert("Payment failed or cancelled. Please try again.");
    }
  };

  const handleCOD = async (data: CheckoutForm) => {
    setStep("paying");
    try {
      const res = await fetch("/api/orders/create-cod", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer: data, items: activeItems, total }),
      });
      const { orderNumber } = await res.json();
      setOrderId(orderNumber);

      // Clear cart on success
      localStorage.removeItem("prakashco_cart");
      window.dispatchEvent(new Event("cart-updated"));

      setStep("success");
    } catch {
      setStep("form");
      alert("Order placing failed. Please try again.");
    }
  };

  if (step === "success") {
    return (
      <>
        <Navbar />
        <main className="section-padding" style={{ background: "var(--cream)" }}>
          <div className="container-heritage max-w-lg mx-auto text-center space-y-6 py-16">
            <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
              style={{ background: "var(--brand-light)" }}>
              <Check className="w-10 h-10" style={{ color: "var(--brand-primary)" }} />
            </div>
            <h1 className="font-serif text-2xl text-charcoal">Order Confirmed!</h1>
            <HeritageDivider color="gold" size="sm" className="justify-center" />
            <p className="text-muted">
              Thank you for your order. Your order number is:
            </p>
            <p className="font-serif text-xl font-bold" style={{ color: "var(--brand-primary)" }}>
              {orderId}
            </p>
            <p className="text-sm text-muted">
              A confirmation email has been sent to your inbox.{" "}
              {paymentMethod === "cod" && "Please have the amount ready for our delivery partner."}
            </p>
            <div className="pt-4">
              <Link href="/shop" className="btn-primary inline-flex justify-center text-xs">
                Continue Shopping
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      {/* Razorpay script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      <Navbar />
      <main className="section-padding" style={{ background: "var(--cream)" }}>
        <div className="container-heritage">
          <div className="mb-10 space-y-2">
            <h1 className="font-serif text-heading-xl text-charcoal">Checkout</h1>
            <HeritageDivider color="gold" size="sm" className="justify-start" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left — Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Contact */}
                <div className="bg-white rounded-sm p-6 space-y-4"
                  style={{ border: "1px solid rgba(10,155,75,0.1)" }}>
                  <h2 className="font-serif text-lg font-semibold text-charcoal">Contact Information</h2>
                  <p className="text-xs text-muted">No account required — guest checkout supported.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1">Full Name *</label>
                      <input {...register("name")} className="input-heritage" placeholder="Your full name" />
                      {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1">Phone *</label>
                      <input {...register("phone")} className="input-heritage" placeholder="10-digit mobile" type="tel" maxLength={10} />
                      {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-charcoal mb-1">Email *</label>
                      <input {...register("email")} className="input-heritage" placeholder="your@email.com" type="email" />
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="bg-white rounded-sm p-6 space-y-4"
                  style={{ border: "1px solid rgba(10,155,75,0.1)" }}>
                  <h2 className="font-serif text-lg font-semibold text-charcoal">Delivery Address</h2>

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Address Line 1 *</label>
                    <input {...register("line1")} className="input-heritage" placeholder="House/Flat no., Street, Area" />
                    {errors.line1 && <p className="text-xs text-red-500 mt-1">{errors.line1.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Address Line 2</label>
                    <input {...register("line2")} className="input-heritage" placeholder="Landmark (optional)" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1">City *</label>
                      <input {...register("city")} className="input-heritage" placeholder="City" />
                      {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1">State *</label>
                      <input {...register("state")} className="input-heritage" placeholder="State" />
                      {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1">PIN Code *</label>
                      <input {...register("pincode")} className="input-heritage" placeholder="6-digit PIN" maxLength={6} />
                      {errors.pincode && <p className="text-xs text-red-500 mt-1">{errors.pincode.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Order Notes</label>
                    <textarea {...register("notes")} className="input-heritage" rows={2} placeholder="Special instructions (optional)" />
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-sm p-6 space-y-4"
                  style={{ border: "1px solid rgba(10,155,75,0.1)" }}>
                  <h2 className="font-serif text-lg font-semibold text-charcoal">Payment Method</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {(["razorpay", "cod"] as PaymentMethod[]).map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`flex items-center gap-3 p-4 rounded-sm border-2 transition-all text-left cursor-pointer ${
                          paymentMethod === method
                            ? "border-brand-primary bg-brand-light"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {method === "razorpay" ? (
                          <CreditCard className="w-5 h-5 flex-shrink-0" style={{ color: paymentMethod === "razorpay" ? "var(--brand-primary)" : "var(--muted)" }} />
                        ) : (
                          <Banknote className="w-5 h-5 flex-shrink-0" style={{ color: paymentMethod === "cod" ? "var(--brand-primary)" : "var(--muted)" }} />
                        )}
                        <div>
                          <p className={`text-sm font-medium ${paymentMethod === method ? "text-brand-primary" : "text-charcoal"}`}>
                            {method === "razorpay" ? "Pay Online" : "Cash on Delivery"}
                          </p>
                          <p className="text-[11px] text-muted">
                            {method === "razorpay" ? "UPI, Card, Net Banking" : "Pay when delivered"}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right — Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-sm p-6 sticky top-24"
                  style={{ border: "1px solid rgba(10,155,75,0.15)" }}>
                  <h2 className="font-serif text-lg font-semibold text-charcoal mb-5">Order Summary</h2>

                  <div className="space-y-3 mb-5">
                    {activeItems.map((item, idx) => (
                      <div key={`${item.name}-${idx}`} className="flex justify-between text-sm">
                        <div>
                          <p className="text-charcoal font-medium leading-tight">{item.name}</p>
                          <p className="text-muted text-xs">{item.variant} × {item.qty}</p>
                        </div>
                        <span className="text-charcoal font-medium">{formatPrice(item.price * item.qty)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 text-sm pt-4 border-t border-gray-100">
                    <div className="flex justify-between text-muted">
                      <span>Subtotal</span><span className="text-charcoal">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-muted">
                      <span>GST (5%)</span><span className="text-charcoal">{formatPrice(gst)}</span>
                    </div>
                    <div className="flex justify-between text-muted">
                      <span>Shipping</span>
                      <span className={shipping === 0 ? "text-brand-primary font-medium" : "text-charcoal"}>
                        {shipping === 0 ? "FREE" : formatPrice(shipping)}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold text-base pt-3 border-t border-gray-100">
                      <span className="font-serif">Total</span>
                      <span style={{ color: "var(--brand-primary)" }}>{formatPrice(total)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || step === "paying"}
                    className="btn-primary w-full justify-center mt-6 text-sm"
                  >
                    {isSubmitting || step === "paying" ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
                    ) : paymentMethod === "razorpay" ? (
                      <><CreditCard className="w-4 h-4" /> Pay {formatPrice(total)}</>
                    ) : (
                      <><Banknote className="w-4 h-4" /> Place COD Order</>
                    )}
                  </button>

                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted">
                    🔒 <span>Secure checkout powered by Razorpay</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
