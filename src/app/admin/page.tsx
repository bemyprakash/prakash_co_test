import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import {
  ShoppingCart, Package, Users, TrendingUp,
  AlertTriangle, CheckCircle, Clock, IndianRupee,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Dashboard" };
export const revalidate = 0; // Disable dynamic caching for live admin monitoring

export default async function AdminDashboard() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 1. Today's Revenue and Orders count
  const ordersToday = await prisma.order.findMany({
    where: {
      createdAt: { gte: today },
      status: { notIn: ["CANCELLED", "REFUNDED"] },
    },
    select: { total: true },
  });

  const revenueToday = ordersToday.reduce((sum, order) => sum + Number(order.total), 0);
  const ordersTodayCount = ordersToday.length;

  // 2. Active products count
  const totalProducts = await prisma.product.count({
    where: { isActive: true },
  });

  // 3. Distinct customers (guest checkouts or registered users)
  const allOrders = await prisma.order.findMany({
    select: { guestEmail: true, userId: true },
  });
  const distinctEmails = new Set(
    allOrders.map(o => o.guestEmail || o.userId).filter(Boolean)
  );
  const totalCustomers = distinctEmails.size;

  // 4. Top 5 Recent Orders
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  // 5. In-memory low stock processing (highly robust cross-database logic)
  const allProducts = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      variants: {
        where: { isActive: true },
      },
    },
  });

  const lowStockItems: Array<{ name: string; stock: number; threshold: number }> = [];

  allProducts.forEach(p => {
    if (p.variants.length === 0) {
      if (p.stock <= p.lowStockThreshold) {
        lowStockItems.push({
          name: p.name,
          stock: p.stock,
          threshold: p.lowStockThreshold,
        });
      }
    } else {
      p.variants.forEach(v => {
        if (v.stock <= v.lowStockThreshold) {
          lowStockItems.push({
            name: `${p.name} (${v.label})`,
            stock: v.stock,
            threshold: v.lowStockThreshold,
          });
        }
      });
    }
  });

  const STATS = [
    { label: "Today's Revenue",    value: formatPrice(revenueToday),   delta: "Live",  icon: IndianRupee,   color: "var(--brand-primary)", bg: "var(--brand-light)" },
    { label: "Orders Today",       value: String(ordersTodayCount),    delta: `+${ordersTodayCount}`, icon: ShoppingCart,  color: "var(--gold)",          bg: "#FFF8EC" },
    { label: "Total Active Items", value: String(totalProducts),       delta: "Catalog",icon: Package,       color: "#3B82F6",              bg: "#EFF6FF" },
    { label: "Total Customers",    value: String(totalCustomers),      delta: "Shoppers",icon: Users,       color: "#8B5CF6",              bg: "#F5F3FF" },
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

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal">Dashboard</h1>
          <p className="text-sm text-muted mt-1">
            Welcome back — here&apos;s what&apos;s happening at Prakash&apos;s today.
          </p>
        </div>
        <Link href="/admin/orders" className="btn-primary text-sm py-2">
          <ShoppingCart className="w-4 h-4" />
          View Orders
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-sm p-5 border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-sm flex items-center justify-center" style={{ background: stat.bg }}>
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-50 text-muted">{stat.delta}</span>
              </div>
              <p className="font-serif text-2xl font-bold text-charcoal">{stat.value}</p>
              <p className="text-xs text-muted mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-sm border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-50">
            <h2 className="font-serif text-base font-semibold text-charcoal">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs text-brand-primary hover:underline">View all</Link>
          </div>
          <div className="overflow-x-auto">
            {recentOrders.length === 0 ? (
              <p className="p-8 text-center text-sm text-muted">No orders found in the database yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-gray-50">
                    <th className="px-5 py-3 text-xs font-medium text-muted">Order</th>
                    <th className="px-5 py-3 text-xs font-medium text-muted">Customer</th>
                    <th className="px-5 py-3 text-xs font-medium text-muted">Total</th>
                    <th className="px-5 py-3 text-xs font-medium text-muted">Method</th>
                    <th className="px-5 py-3 text-xs font-medium text-muted">Status</th>
                    <th className="px-5 py-3 text-xs font-medium text-muted">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3 font-medium text-charcoal text-xs">{order.orderNumber}</td>
                      <td className="px-5 py-3 text-muted text-xs">{order.guestName || "Registered User"}</td>
                      <td className="px-5 py-3 font-medium text-charcoal">{formatPrice(Number(order.total))}</td>
                      <td className="px-5 py-3">
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${order.paymentMethod === "COD" ? "bg-orange-50 text-orange-600" : "bg-green-50 text-green-600"}`}>
                          {order.paymentMethod}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <Link href={`/admin/orders/${order.id}`} className="text-xs text-brand-primary hover:underline font-medium">
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-sm border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 p-5 border-b border-gray-50">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            <h2 className="font-serif text-base font-semibold text-charcoal">Low Stock Alert</h2>
          </div>
          <div className="p-4 space-y-3">
            {lowStockItems.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-xs text-muted">✓ All products have adequate stock levels.</p>
              </div>
            ) : (
              lowStockItems.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-3 rounded-sm bg-orange-50/50 border border-orange-100/50">
                  <div className="max-w-[75%]">
                    <p className="text-xs font-medium text-charcoal leading-tight truncate">{item.name}</p>
                    <p className="text-[11px] text-muted mt-0.5">
                      {item.stock} left (threshold: {item.threshold})
                    </p>
                  </div>
                  <span className="text-lg font-bold text-orange-600">{item.stock}</span>
                </div>
              ))
            )}
            <Link href="/admin/inventory" className="block text-center text-xs text-brand-primary hover:underline pt-2">
              Manage Inventory →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Manage Products",  href: "/admin/products",      icon: Package,       color: "bg-brand-light text-brand-primary" },
          { label: "Process Orders",   href: "/admin/orders",        icon: CheckCircle,   color: "bg-blue-50 text-blue-600" },
          { label: "Add Product",      href: "/admin/products/new",  icon: TrendingUp,    color: "bg-purple-50 text-purple-600" },
          { label: "View Site",        href: "/shop",                icon: Clock,         color: "bg-gold/10 text-gold-dark" },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center gap-3 p-4 bg-white rounded-sm border border-gray-100 hover:border-brand-primary hover:shadow-sm transition-all"
            >
              <div className={`w-9 h-9 rounded-sm flex items-center justify-center ${action.color}`}>
                <Icon className="w-4.5 h-4.5" />
              </div>
              <span className="text-sm font-medium text-charcoal">{action.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
