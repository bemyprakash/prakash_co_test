import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";
import { PrinterTrigger } from "../invoice/PrinterTrigger";

export const metadata: Metadata = { title: "Packing Slip" };
export const revalidate = 0;

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PackingSlipPage({ params }: Props) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen text-charcoal font-sans p-6 md:p-10 max-w-[800px] mx-auto space-y-8 select-none">
      <PrinterTrigger />

      {/* Header */}
      <div className="flex justify-between items-center border-b pb-6 border-gray-200">
        <div>
          <h1 className="font-serif text-xl font-bold tracking-wide" style={{ color: "var(--brand-deep)" }}>
            A. Prakash & Co.
          </h1>
          <p className="text-[10px] text-muted tracking-widest uppercase">Since 1928 Legacy Fine Foods</p>
        </div>
        <div className="text-right">
          <h2 className="text-lg font-bold tracking-widest text-gray-800 uppercase font-serif">PACKING SLIP</h2>
          <p className="text-xs text-muted mt-1">
            Order No: <span className="font-mono text-charcoal font-bold">{order.orderNumber}</span>
          </p>
        </div>
      </div>

      {/* Pick/Pack Logistics Header */}
      <div className="grid grid-cols-3 gap-6 bg-gray-50 p-4 border border-gray-100 rounded-sm text-xs">
        <div>
          <span className="text-[10px] text-muted uppercase font-semibold block">Date Placed</span>
          <span className="font-medium text-charcoal">{formatDate(order.createdAt)}</span>
        </div>
        <div>
          <span className="text-[10px] text-muted uppercase font-semibold block">Courier Logistics</span>
          <span className="font-medium text-charcoal uppercase">{order.paymentMethod} Payment</span>
        </div>
        <div>
          <span className="text-[10px] text-muted uppercase font-semibold block">Courier Tracking</span>
          <span className="font-mono font-bold text-charcoal">{order.trackingNumber || "PENDING DISPATCH"}</span>
        </div>
      </div>

      {/* Large Delivery Address Card for Packaging Box */}
      <div className="border border-gray-200 p-6 rounded-sm space-y-3 shadow-sm bg-white">
        <h3 className="font-serif font-bold text-xs text-gray-800 uppercase tracking-widest pb-2 border-b border-gray-100">
          📍 Delivery Shipping Label (Glue to Package Box):
        </h3>
        <div className="space-y-1.5 text-xs text-charcoal leading-relaxed">
          <p className="font-serif font-bold text-base text-brand-primary uppercase tracking-wide">{order.shippingName}</p>
          <p className="text-sm font-medium">{order.shippingLine1}</p>
          {order.shippingLine2 && <p className="text-sm font-medium">{order.shippingLine2}</p>}
          <p className="text-sm font-bold">
            {order.shippingCity}, {order.shippingState} - <span className="font-mono text-base font-black text-charcoal bg-yellow-50 px-1 border border-yellow-200/50">{order.shippingPincode}</span>
          </p>
          <p className="font-semibold text-gray-500">{order.shippingCountry}</p>
          <div className="pt-3 flex gap-6 text-sm">
            <p className="font-black text-charcoal">📞 Phone: {order.shippingPhone}</p>
            <p className="text-muted">Email: {order.guestEmail}</p>
          </div>
        </div>
      </div>

      {/* Picking Checklist Table */}
      <div className="space-y-3">
        <h3 className="font-serif font-bold text-xs text-gray-800 uppercase tracking-widest">
          📦 Package Items Picking Checklist:
        </h3>
        <table className="w-full text-xs text-left border-collapse border border-gray-200">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/80">
              <th className="py-2.5 px-3 font-bold text-gray-800 text-center w-12 border-r">Pack ✓</th>
              <th className="py-2.5 px-3 font-bold text-gray-800">Product Name / Item Description</th>
              <th className="py-2.5 px-3 font-bold text-gray-800 text-center w-28 border-l">Weight/Variant</th>
              <th className="py-2.5 px-3 font-bold text-gray-800 text-center w-24 border-l">Quantity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {order.items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/10">
                <td className="py-3 px-3 text-center border-r">
                  <div className="w-5 h-5 border border-gray-400 rounded-sm mx-auto flex items-center justify-center font-mono font-bold text-gray-200">
                    [ ]
                  </div>
                </td>
                <td className="py-3 px-3">
                  <p className="font-serif font-bold text-charcoal text-xs">{item.productName}</p>
                  <p className="text-[10px] text-muted font-mono mt-0.5">HSN: {item.hsnCode || "0902"}</p>
                </td>
                <td className="py-3 px-3 text-center font-medium border-l text-gray-600">
                  {item.variantLabel || "Standard Weight"}
                </td>
                <td className="py-3 px-3 text-center text-sm font-black border-l text-charcoal">
                  × {item.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer Notes */}
      {order.notes && (
        <div className="bg-yellow-50/40 p-4 rounded-sm border border-yellow-100 text-xs space-y-1">
          <p className="font-serif font-bold text-yellow-800 uppercase tracking-widest text-[10px]">
            ⚠️ Customer Logistics instructions:
          </p>
          <p className="text-yellow-900 leading-relaxed italic">{order.notes}</p>
        </div>
      )}

      {/* Pick/Pack Footer and Sign-Offs */}
      <div className="grid grid-cols-2 gap-12 pt-12 border-t border-gray-200 border-dashed text-[11px] text-muted">
        <div className="space-y-1">
          <p className="font-serif font-bold text-gray-800 uppercase tracking-widest">Picking Instructions:</p>
          <p className="leading-relaxed">
            Please ensure all glass jars are bubble-wrapped adequately and nested with eco-shred cardboard inside our heritage gift boxes to prevent travel fractures.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="space-y-4">
            <div className="h-8 border-b border-gray-300 w-24 mx-auto" />
            <p className="font-semibold text-gray-800">Picked By</p>
          </div>
          <div className="space-y-4">
            <div className="h-8 border-b border-gray-300 w-24 mx-auto" />
            <p className="font-semibold text-gray-800">Verified & Packed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
