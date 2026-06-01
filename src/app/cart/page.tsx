"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeritageDivider } from "@/components/heritage/HeritageDivider";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface CartItem {
  id: string;
  name: string;
  variant?: string;
  price: number;
  quantity: number;
  image?: string;
}

// Simple localStorage cart — will wire to server cart action later
function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("prakashco_cart");
    if (stored) setItems(JSON.parse(stored));
  }, []);

  const save = (updated: CartItem[]) => {
    setItems(updated);
    localStorage.setItem("prakashco_cart", JSON.stringify(updated));
  };

  const updateQty = (id: string, delta: number) => {
    const updated = items
      .map((i) => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i)
      .filter((i) => i.quantity > 0);
    save(updated);
  };

  const remove = (id: string) => save(items.filter((i) => i.id !== id));

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return { items, updateQty, remove, subtotal };
}

// Demo items so cart isn't empty on first visit
const DEMO_ITEMS: CartItem[] = [
  { id: "1", name: "Darjeeling First Flush Tea", variant: "250g", price: 450, quantity: 1 },
  { id: "2", name: "Himalayan Honey Jam",        variant: "500g", price: 280, quantity: 2 },
];

export default function CartPage() {
  const { items: storedItems, updateQty, remove, subtotal } = useCart();
  const [coupon, setCoupon]   = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState<{ ok: boolean; msg: string } | null>(null);

  // Seed demo items if cart is empty
  const [seeded, setSeeded] = useState(false);
  useEffect(() => {
    if (!seeded && storedItems.length === 0) {
      localStorage.setItem("prakashco_cart", JSON.stringify(DEMO_ITEMS));
      setSeeded(true);
      window.location.reload();
    }
    setSeeded(true);
  }, [storedItems, seeded]);

  const items = storedItems.length > 0 ? storedItems : DEMO_ITEMS;

  const shipping  = subtotal > 500 ? 0 : 80;
  const gstAmount = Math.round((subtotal - discount) * 0.05);
  const total     = subtotal - discount + gstAmount + shipping;

  const applyCoupon = () => {
    if (coupon.toUpperCase() === "HERITAGE10") {
      setDiscount(Math.round(subtotal * 0.1));
      setCouponMsg({ ok: true, msg: "10% discount applied! 🎉" });
    } else if (coupon.toUpperCase() === "PRAKASH") {
      setDiscount(100);
      setCouponMsg({ ok: true, msg: "₹100 off applied! 🎉" });
    } else {
      setDiscount(0);
      setCouponMsg({ ok: false, msg: "Invalid coupon code." });
    }
  };

  return (
    <>
      <Navbar cartCount={items.reduce((s, i) => s + i.quantity, 0)} />
      <main className="section-padding" style={{ background: "var(--cream)" }}>
        <div className="container-heritage">
          {/* Header */}
          <div className="mb-10 space-y-2">
            <h1 className="font-serif text-heading-xl text-charcoal">Your Cart</h1>
            <HeritageDivider color="gold" size="sm" className="justify-start" />
          </div>

          {items.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <ShoppingBag className="w-16 h-16 mx-auto text-gray-200" />
              <h2 className="font-serif text-xl text-charcoal">Your cart is empty</h2>
              <p className="text-muted">Add some of our heritage products to get started.</p>
              <Link href="/shop" className="btn-primary mt-4 inline-flex">
                Browse Products
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-sm p-5 flex gap-4 items-start"
                    style={{ border: "1px solid rgba(10,155,75,0.1)" }}
                  >
                    {/* Image placeholder */}
                    <div
                      className="w-20 h-20 rounded-sm flex items-center justify-center flex-shrink-0 text-3xl"
                      style={{ background: "var(--brand-light)" }}
                    >
                      🍃
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <div>
                          <h3 className="font-serif text-sm font-semibold text-charcoal">{item.name}</h3>
                          {item.variant && <p className="text-xs text-muted mt-0.5">{item.variant}</p>}
                        </div>
                        <button
                          onClick={() => remove(item.id)}
                          className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Qty controls */}
                        <div
                          className="flex items-center gap-3 rounded-sm border"
                          style={{ borderColor: "rgba(10,155,75,0.2)" }}
                        >
                          <button
                            onClick={() => updateQty(item.id, -1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-brand-light transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQty(item.id, 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-brand-light transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="font-semibold text-charcoal">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Coupon */}
                <div className="bg-white rounded-sm p-5" style={{ border: "1px solid rgba(10,155,75,0.1)" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-brand-primary" />
                    <span className="font-medium text-sm text-charcoal">Coupon Code</span>
                  </div>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Enter code (try HERITAGE10)"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                      className="input-heritage flex-1"
                    />
                    <button onClick={applyCoupon} className="btn-secondary py-2 px-4 text-sm whitespace-nowrap">
                      Apply
                    </button>
                  </div>
                  {couponMsg && (
                    <p className={`text-xs mt-2 ${couponMsg.ok ? "text-brand-primary" : "text-red-500"}`}>
                      {couponMsg.msg}
                    </p>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div
                  className="bg-white rounded-sm p-6 sticky top-24"
                  style={{ border: "1px solid rgba(10,155,75,0.15)" }}
                >
                  <h2 className="font-serif text-lg font-semibold text-charcoal mb-5">Order Summary</h2>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-muted">
                      <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                      <span className="text-charcoal">{formatPrice(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-brand-primary">
                        <span>Coupon Discount</span>
                        <span>−{formatPrice(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-muted">
                      <span>GST (5%)</span>
                      <span className="text-charcoal">{formatPrice(gstAmount)}</span>
                    </div>
                    <div className="flex justify-between text-muted">
                      <span>Shipping</span>
                      <span className={shipping === 0 ? "text-brand-primary font-medium" : "text-charcoal"}>
                        {shipping === 0 ? "FREE" : formatPrice(shipping)}
                      </span>
                    </div>
                    {shipping === 0 && (
                      <p className="text-xs text-brand-primary">✓ Free shipping on orders above ₹500</p>
                    )}
                  </div>

                  <div
                    className="flex justify-between font-semibold text-base mt-5 pt-5"
                    style={{ borderTop: "1px solid rgba(10,155,75,0.1)" }}
                  >
                    <span className="font-serif">Total</span>
                    <span style={{ color: "var(--brand-primary)" }}>{formatPrice(total)}</span>
                  </div>

                  <Link href="/checkout" className="btn-primary w-full justify-center mt-6 text-sm">
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link href="/shop" className="block text-center text-xs text-muted hover:text-brand-primary mt-4 transition-colors">
                    ← Continue Shopping
                  </Link>

                  {/* Trust badges */}
                  <div className="mt-6 pt-5 space-y-2" style={{ borderTop: "1px solid rgba(10,155,75,0.1)" }}>
                    {["🔒 Secure Payment", "🏛️ Since 1928", "📦 Fast Dispatch"].map((badge) => (
                      <div key={badge} className="flex items-center gap-2 text-xs text-muted">
                        <span>{badge}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
