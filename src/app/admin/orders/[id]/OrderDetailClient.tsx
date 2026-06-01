"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Printer, FileText, CheckCircle, Package, Truck, Calendar, ShoppingCart, IndianRupee } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface OrderItem {
  id: string;
  productName: string;
  variantLabel: string | null;
  price: string;
  quantity: number;
  gstPercent: string;
  hsnCode: string | null;
}

interface Order {
  id: string;
  orderNumber: string;
  guestName: string | null;
  guestEmail: string | null;
  guestPhone: string | null;
  shippingName: string;
  shippingPhone: string;
  shippingLine1: string;
  shippingLine2: string | null;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
  shippingCountry: string;
  subtotal: string;
  discount: string;
  gstAmount: string;
  shippingFee: string;
  total: string;
  paymentMethod: "RAZORPAY" | "COD";
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  status: "PENDING" | "CONFIRMED" | "PACKED" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";
  trackingNumber: string | null;
  notes: string | null;
  adminNotes: string | null;
  createdAt: string;
  items: OrderItem[];
}

interface Props {
  order: Order;
}

export function OrderDetailClient({ order }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(order.status);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || "");
  const [adminNotes, setAdminNotes] = useState(order.adminNotes || "");
  const [updating, setUpdating] = useState(false);

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          trackingNumber,
          adminNotes,
        }),
      });

      if (!res.ok) throw new Error();

      toast.success("Order details updated successfully!");
      router.refresh();
    } catch {
      toast.error("Failed to update order details.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/admin/orders"
          className="flex items-center gap-1.5 text-xs text-muted hover:text-brand-primary transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>
        <div className="flex gap-3">
          <a
            href={`/admin/orders/${order.id}/packing-slip`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary py-1.5 px-4 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Packing Slip
          </a>
          <a
            href={`/admin/orders/${order.id}/invoice`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary py-1.5 px-4 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            GST Tax Invoice
          </a>
        </div>
      </div>

      {/* Header Info */}
      <div className="bg-white rounded-sm p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="font-mono text-charcoal font-bold text-lg md:text-xl">#{order.orderNumber}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
              order.paymentMethod === "COD" ? "bg-amber-50 text-amber-700" : "bg-green-50 text-green-700"
            }`}>
              {order.paymentMethod}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {formatDate(order.createdAt)}</span>
            <span>•</span>
            <span>Items: {order.items.reduce((s, i) => s + i.quantity, 0)}</span>
            <span>•</span>
            <span className="font-semibold text-charcoal">Total: {formatPrice(Number(order.total))}</span>
          </div>
        </div>

        {/* Current status display */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] text-muted uppercase font-semibold">Current Status</p>
            <p className="font-serif font-bold text-charcoal text-base">{status}</p>
          </div>
          <div className="w-10 h-10 rounded-sm flex items-center justify-center bg-brand-light">
            <Package className="w-5 h-5 text-brand-primary" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column — Details & Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items Table */}
          <div className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-50 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-brand-primary" />
              <h2 className="font-serif text-base font-semibold text-charcoal">Order Items</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-gray-50 bg-gray-50/50">
                  <th className="px-5 py-3 text-xs font-medium text-muted">Product</th>
                  <th className="px-5 py-3 text-xs font-medium text-muted">HSN</th>
                  <th className="px-5 py-3 text-xs font-medium text-muted text-right">Price</th>
                  <th className="px-5 py-3 text-xs font-medium text-muted text-center">Qty</th>
                  <th className="px-5 py-3 text-xs font-medium text-muted text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {order.items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/20 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-serif font-semibold text-charcoal text-xs">{item.productName}</p>
                      {item.variantLabel && (
                        <p className="text-[10px] text-muted mt-0.5">{item.variantLabel}</p>
                      )}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-[11px] text-muted">{item.hsnCode || "—"}</td>
                    <td className="px-5 py-3.5 text-right font-medium text-charcoal">{formatPrice(Number(item.price))}</td>
                    <td className="px-5 py-3.5 text-center font-medium text-charcoal">{item.quantity}</td>
                    <td className="px-5 py-3.5 text-right font-semibold text-charcoal">
                      {formatPrice(Number(item.price) * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pricing Summary */}
            <div className="p-5 bg-gray-50/50 border-t border-gray-50 flex justify-end">
              <div className="w-72 space-y-2 text-xs">
                <div className="flex justify-between text-muted">
                  <span>Subtotal</span>
                  <span className="text-charcoal font-medium">{formatPrice(Number(order.subtotal))}</span>
                </div>
                {Number(order.discount) > 0 && (
                  <div className="flex justify-between text-brand-primary">
                    <span>Coupon Discount</span>
                    <span>−{formatPrice(Number(order.discount))}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted">
                  <span>GST Amount</span>
                  <span className="text-charcoal font-medium">{formatPrice(Number(order.gstAmount))}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Shipping Fee</span>
                  <span className="text-charcoal font-medium">
                    {Number(order.shippingFee) === 0 ? "FREE" : formatPrice(Number(order.shippingFee))}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-sm pt-2 border-t border-gray-100">
                  <span className="font-serif text-charcoal">Grand Total</span>
                  <span className="text-brand-primary">{formatPrice(Number(order.total))}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery & Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-sm p-5 border border-gray-100 shadow-sm space-y-3">
              <h3 className="font-serif font-semibold text-sm text-charcoal uppercase tracking-wider pb-2 border-b">
                Shipping Address
              </h3>
              <div className="text-xs text-charcoal space-y-1">
                <p className="font-medium text-sm text-brand-primary">{order.shippingName}</p>
                <p>{order.shippingLine1}</p>
                {order.shippingLine2 && <p>{order.shippingLine2}</p>}
                <p>{order.shippingCity}, {order.shippingState} - <span className="font-mono">{order.shippingPincode}</span></p>
                <p>{order.shippingCountry}</p>
                <p className="pt-2 font-medium">📞 Phone: {order.shippingPhone}</p>
              </div>
            </div>

            {/* Customer Contact */}
            <div className="bg-white rounded-sm p-5 border border-gray-100 shadow-sm space-y-3">
              <h3 className="font-serif font-semibold text-sm text-charcoal uppercase tracking-wider pb-2 border-b">
                Customer Details
              </h3>
              <div className="text-xs text-charcoal space-y-2">
                <div>
                  <p className="text-muted text-[10px] uppercase font-semibold">Guest Name</p>
                  <p className="font-medium text-sm">{order.guestName || "Guest Account"}</p>
                </div>
                <div>
                  <p className="text-muted text-[10px] uppercase font-semibold">Email Address</p>
                  <p className="font-mono text-brand-primary font-medium">{order.guestEmail}</p>
                </div>
                <div>
                  <p className="text-muted text-[10px] uppercase font-semibold">Contact Phone</p>
                  <p className="font-mono">{order.guestPhone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Notes */}
          {order.notes && (
            <div className="bg-yellow-50/50 p-5 rounded-sm border border-yellow-100 space-y-2">
              <h4 className="text-xs font-serif font-bold text-yellow-800 uppercase tracking-wider flex items-center gap-1.5">
                💬 Customer Order Notes
              </h4>
              <p className="text-xs text-yellow-900 leading-relaxed italic">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Right Column — Status Management Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-sm p-6 border border-gray-100 shadow-sm sticky top-24 space-y-5">
            <h3 className="font-serif font-bold text-charcoal text-base pb-3 border-b">
              Manage Operations
            </h3>

            <form onSubmit={handleUpdateOrder} className="space-y-4">
              {/* Order Status */}
              <div>
                <label className="block text-xs font-serif font-bold text-charcoal uppercase tracking-wider mb-1.5">
                  Order Status *
                </label>
                <select
                  value={status}
                  onChange={(e: any) => setStatus(e.target.value)}
                  className="input-heritage text-xs cursor-pointer"
                >
                  <option value="PENDING">🕒 Pending COD / Review</option>
                  <option value="CONFIRMED">✓ Confirmed (Process Packing)</option>
                  <option value="PACKED">📦 Packed (Ready for Dispatch)</option>
                  <option value="SHIPPED">🚚 Shipped (In Transit)</option>
                  <option value="DELIVERED">🎉 Delivered Successfully</option>
                  <option value="CANCELLED">❌ Cancelled</option>
                </select>
              </div>

              {/* Tracking ID */}
              <div>
                <label className="block text-xs font-serif font-bold text-charcoal uppercase tracking-wider mb-1.5">
                  Courier Tracking No.
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="E.g., Delhivery - 1928001"
                  className="input-heritage text-xs"
                />
              </div>

              {/* Admin Internal Notes */}
              <div>
                <label className="block text-xs font-serif font-bold text-charcoal uppercase tracking-wider mb-1.5">
                  Internal Operations Notes
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Only visible to admins. E.g., Customer requested delivery after 5 PM."
                  rows={4}
                  className="input-heritage text-xs"
                />
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={updating}
                className="btn-primary w-full justify-center text-xs py-2.5"
              >
                {updating ? (
                  <Loader2 className="w-4.5 h-4.5 animate-spin" />
                ) : (
                  "Update Operations Data"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function Loader2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="animate-spin"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
