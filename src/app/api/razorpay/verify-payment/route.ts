import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customer,
      items,
      total,
    } = await req.json();

    // 1. Verify Razorpay signature
    const body       = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected   = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // 2. Create order in database
    const orderNumber = generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        guestName:        customer.name,
        guestEmail:       customer.email,
        guestPhone:       customer.phone,
        shippingName:     customer.name,
        shippingPhone:    customer.phone,
        shippingLine1:    customer.line1,
        shippingLine2:    customer.line2 || null,
        shippingCity:     customer.city,
        shippingState:    customer.state,
        shippingPincode:  customer.pincode,
        shippingCountry:  "India",
        subtotal:         total,
        total:            total,
        paymentMethod:    "RAZORPAY",
        paymentStatus:    "PAID",
        razorpayOrderId:  razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status:           "CONFIRMED",
        notes:            customer.notes,
        items: {
          create: items.map((item: { productId: string; variantId?: string; name: string; variant?: string; price: number; qty: number }) => ({
            productName:  item.name,
            variantLabel: item.variant || null,
            price:        item.price,
            quantity:     item.qty,
            gstPercent:   5,
            product: { connect: { id: item.productId } },
            ...(item.variantId ? { variant: { connect: { id: item.variantId } } } : {}),
          })),
        },
      },
    });

    return NextResponse.json({ orderNumber: order.orderNumber, orderId: order.id });
  } catch (error) {
    console.error("Verify payment error:", error);
    return NextResponse.json({ error: "Order creation failed" }, { status: 500 });
  }
}
