import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";
import { Search, ChevronRight, ShoppingCart } from "lucide-react";

export const metadata: Metadata = { title: "Manage Orders" };
export const revalidate = 0; // Fresh orders on demand

interface Props {
  searchParams: Promise<{
    q?: string;
    status?: string;
  }>;
}

const STATUS_OPTIONS = [
  { label: "All Orders", value: "" },
  { label: "Pending",    value: "PENDING" },
  { label: "Confirmed",  value: "CONFIRMED" },
  { label: "Packed",     value: "PACKED" },
  { label: "Shipped",    value: "SHIPPED" },
  { label: "Delivered",  value: "DELIVERED" },
  { label: "Cancelled",  value: "CANCELLED" },
];

const STATUS_COLORS: Record<string, string> = {
  PENDING:   "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PACKED:    "bg-purple-100 text-purple-700",
  SHIPPED:   "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  REFUNDED:  "bg-gray-100 text-gray-700",
};

export default async function AdminOrdersPage({ searchParams }: Props) {
  const { q, status } = await searchParams;

  // 1. Build where query
  const where: any = {};

  if (status) {
    where.status = status;
  }

  if (q) {
    where.OR = [
      { orderNumber: { contains: q } },
      { guestName: { contains: q } },
      { guestEmail: { contains: q } },
      { guestPhone: { contains: q } },
    ];
  }

  // 2. Fetch orders
  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
    },
  });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-charcoal">Manage Orders</h1>
        <p className="text-sm text-muted mt-1">
          Review, update status, and print slips/invoices for all customer orders.
        </p>
      </div>

      {/* Filter controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-sm border border-gray-100 shadow-sm">
        {/* Search */}
        <form className="relative w-full md:w-80 flex-shrink-0" method="GET">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
          <input
            type="search"
            name="q"
            defaultValue={q || ""}
            placeholder="Search order no. or customer…"
            className="input-heritage pl-10 pr-4 text-xs py-2"
          />
          {status && <input type="hidden" name="status" value={status} />}
        </form>

        {/* Status filters */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {STATUS_OPTIONS.map((opt) => (
            <Link
              key={opt.value}
              href={`/admin/orders?status=${opt.value}${q ? `&q=${q}` : ""}`}
              className={`text-xs px-3 py-1.5 rounded-sm font-medium transition-all ${
                (status || "") === opt.value
                  ? "bg-brand-primary text-white"
                  : "bg-gray-50 text-muted hover:bg-brand-light hover:text-brand-primary"
              }`}
            >
              {opt.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden">
        {orders.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto text-muted">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <p className="font-serif text-base font-semibold text-charcoal">No orders found</p>
            <p className="text-xs text-muted">Try a different search criteria or status filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-3.5 text-xs font-semibold text-muted">Order ID</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-muted">Date</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-muted">Customer</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-muted">Items</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-muted">Total</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-muted">Payment</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-muted">Status</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-muted text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => {
                  const itemsCount = order.items.reduce((s, i) => s + i.quantity, 0);
                  return (
                    <tr key={order.id} className="hover:bg-gray-50/20 transition-colors">
                      <td className="px-6 py-4 font-mono font-medium text-xs text-charcoal">{order.orderNumber}</td>
                      <td className="px-6 py-4 text-xs text-muted">{formatDate(order.createdAt)}</td>
                      <td className="px-6 py-4">
                        <div className="text-xs font-medium text-charcoal">{order.guestName || "Guest"}</div>
                        <div className="text-[10px] text-muted">{order.guestEmail}</div>
                      </td>
                      <td className="px-6 py-4 text-xs text-muted">
                        {itemsCount} {itemsCount === 1 ? "item" : "items"}
                      </td>
                      <td className="px-6 py-4 font-semibold text-charcoal">{formatPrice(Number(order.total))}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          order.paymentMethod === "COD" ? "bg-amber-50 text-amber-700" : "bg-green-50 text-green-700"
                        }`}>
                          {order.paymentMethod}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${STATUS_COLORS[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="btn-secondary py-1 px-3 text-xs inline-flex items-center gap-1 cursor-pointer font-medium hover:bg-brand-primary hover:text-white"
                        >
                          Manage
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
