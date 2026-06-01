import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate, generateInvoiceNumber } from "@/lib/utils";
import type { Metadata } from "next";
import { PrinterTrigger } from "./PrinterTrigger";

export const metadata: Metadata = { title: "Tax Invoice" };
export const revalidate = 0;

interface Props {
  params: Promise<{ id: string }>;
}

export default async function InvoicePage({ params }: Props) {
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

  // Calculate invoice date and number
  const invoiceNumber = order.invoiceNumber || generateInvoiceNumber();
  const invoiceDate = formatDate(order.createdAt);

  const subtotal = Number(order.subtotal);
  const gstAmount = Number(order.gstAmount);
  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;
  const shipping = Number(order.shippingFee);
  const discount = Number(order.discount);
  const total = Number(order.total);

  return (
    <div className="bg-white min-h-screen text-charcoal font-sans p-6 md:p-10 max-w-[800px] mx-auto space-y-8 select-none">
      <PrinterTrigger />

      {/* Invoice Header */}
      <div className="flex justify-between items-start border-b-2 border-brand-primary pb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-wide" style={{ color: "var(--brand-deep)" }}>
            A. Prakash & Co.
          </h1>
          <p className="text-[10px] font-mono tracking-widest text-muted uppercase">Purveyors of Heritage Fine Foods Since 1928</p>
          <div className="text-[11px] text-muted space-y-0.5 mt-2">
            <p>12, Heritage Boulevard, Mall Road, Darjeeling, WB - 734101</p>
            <p>Email: orders@aprakashco.com | Tel: +91 98765 43210</p>
            <p className="font-medium text-charcoal">GSTIN: 19AAPCP1928A1Z5</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold font-serif tracking-widest text-gray-800 uppercase">TAX INVOICE</h2>
          <div className="text-xs space-y-1 mt-3 text-muted">
            <p><span className="font-semibold text-charcoal">Invoice No:</span> <span className="font-mono text-charcoal font-medium">{invoiceNumber}</span></p>
            <p><span className="font-semibold text-charcoal">Date:</span> {invoiceDate}</p>
            <p><span className="font-semibold text-charcoal">Order No:</span> <span className="font-mono text-charcoal">{order.orderNumber}</span></p>
            <p><span className="font-semibold text-charcoal">Payment Mode:</span> {order.paymentMethod} ({order.paymentStatus})</p>
          </div>
        </div>
      </div>

      {/* Bill To & Ship To Grid */}
      <div className="grid grid-cols-2 gap-8 text-xs border-b pb-6 border-gray-100">
        <div>
          <h3 className="font-serif font-bold text-gray-800 uppercase tracking-wider mb-2">Billed & Shipped To:</h3>
          <div className="space-y-1 text-muted">
            <p className="font-bold text-sm text-charcoal">{order.shippingName}</p>
            <p>{order.shippingLine1}</p>
            {order.shippingLine2 && <p>{order.shippingLine2}</p>}
            <p>{order.shippingCity}, {order.shippingState} - <span className="font-mono">{order.shippingPincode}</span></p>
            <p>{order.shippingCountry}</p>
            <p className="pt-1.5 font-medium text-charcoal">Phone: {order.shippingPhone}</p>
            <p>Email: {order.guestEmail}</p>
          </div>
        </div>
        <div className="bg-gray-50/50 p-4 border border-gray-100 rounded-sm">
          <h3 className="font-serif font-bold text-gray-800 uppercase tracking-wider mb-2">Compliance Notes:</h3>
          <div className="space-y-1 text-[11px] text-muted">
            <p>1. Supply of goods fits under standard GST schedules.</p>
            <p>2. Reverse charge applicable: No.</p>
            <p>3. State code of supply: 19 (West Bengal).</p>
            <p className="pt-2 font-medium text-charcoal">Thank you for patronizing our heritage shop since 1928!</p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="overflow-hidden">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-200 bg-gray-50/80">
              <th className="py-2.5 px-2 font-bold text-gray-800 text-center w-8">#</th>
              <th className="py-2.5 px-2 font-bold text-gray-800">Description</th>
              <th className="py-2.5 px-2 font-bold text-gray-800 text-center">HSN</th>
              <th className="py-2.5 px-2 font-bold text-gray-800 text-right">Price</th>
              <th className="py-2.5 px-2 font-bold text-gray-800 text-center">Qty</th>
              <th className="py-2.5 px-2 font-bold text-gray-800 text-center">GST %</th>
              <th className="py-2.5 px-2 font-bold text-gray-800 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {order.items.map((item, idx) => {
              const itemTotal = Number(item.price) * item.quantity;
              return (
                <tr key={item.id} className="hover:bg-gray-50/10">
                  <td className="py-3 px-2 text-center text-muted font-mono">{idx + 1}</td>
                  <td className="py-3 px-2">
                    <p className="font-serif font-bold text-charcoal">{item.productName}</p>
                    {item.variantLabel && <p className="text-[10px] text-muted">{item.variantLabel}</p>}
                  </td>
                  <td className="py-3 px-2 text-center font-mono text-[10px] text-muted">{item.hsnCode || "0902"}</td>
                  <td className="py-3 px-2 text-right font-mono">{formatPrice(Number(item.price))}</td>
                  <td className="py-3 px-2 text-center font-medium">{item.quantity}</td>
                  <td className="py-3 px-2 text-center font-mono text-muted">{Number(item.gstPercent)}%</td>
                  <td className="py-3 px-2 text-right font-mono font-semibold">{formatPrice(itemTotal)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Calculations & Summary Grid */}
      <div className="grid grid-cols-2 gap-8 pt-4 border-t border-gray-200">
        {/* GST breakdown split */}
        <div className="text-[11px] text-muted space-y-1.5 p-3 border border-gray-100 bg-gray-50/30 rounded-sm">
          <p className="font-serif font-bold text-gray-800 uppercase tracking-wider mb-1">Tax Split Breakdown:</p>
          <div className="flex justify-between border-b pb-1">
            <span>Central GST (CGST — 2.5%)</span>
            <span className="font-mono">{formatPrice(cgst)}</span>
          </div>
          <div className="flex justify-between border-b pb-1">
            <span>State GST (SGST — 2.5%)</span>
            <span className="font-mono">{formatPrice(sgst)}</span>
          </div>
          <div className="flex justify-between font-semibold text-charcoal">
            <span>Total GST Integrated</span>
            <span className="font-mono">{formatPrice(gstAmount)}</span>
          </div>
        </div>

        {/* Totals Summary */}
        <div className="text-xs space-y-2 max-w-xs ml-auto w-full">
          <div className="flex justify-between text-muted">
            <span>Taxable Value (Subtotal)</span>
            <span className="font-mono text-charcoal">{formatPrice(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-brand-primary font-medium">
              <span>Promo Discount Applied</span>
              <span className="font-mono">−{formatPrice(discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-muted">
            <span>Integrated GST (5%)</span>
            <span className="font-mono text-charcoal">{formatPrice(gstAmount)}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>Delivery & Handling</span>
            <span className="font-mono text-charcoal">
              {shipping === 0 ? "FREE" : formatPrice(shipping)}
            </span>
          </div>
          <div className="flex justify-between font-bold text-sm pt-2 border-t-2 border-gray-800">
            <span className="font-serif text-charcoal">Grand Total (Net)</span>
            <span className="text-brand-deep font-mono" style={{ color: "var(--brand-deep)" }}>
              {formatPrice(total)}
            </span>
          </div>
        </div>
      </div>

      {/* Signature & Disclaimer */}
      <div className="grid grid-cols-2 gap-12 pt-16 text-xs">
        <div className="space-y-1 text-[10px] text-muted">
          <p className="font-serif font-bold text-gray-800 uppercase tracking-widest">Declaration:</p>
          <p className="leading-relaxed">
            We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.
          </p>
        </div>
        <div className="text-right space-y-4">
          <div className="h-10 w-32 border-b border-gray-300 ml-auto" />
          <div>
            <p className="font-serif font-bold text-gray-800 uppercase">A. Prakash & Co.</p>
            <p className="text-[10px] text-muted">Authorized signatory</p>
          </div>
        </div>
      </div>
    </div>
  );
}
