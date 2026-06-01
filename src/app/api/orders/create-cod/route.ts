import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { customer, items, total } = await req.json();

    const orderNumber = generateOrderNumber();

    // Create the order in the database
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
        paymentMethod:    "COD",
        paymentStatus:    "PENDING",
        status:           "PENDING",
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
    console.error("Create COD order error:", error);
    return NextResponse.json({ error: "COD order creation failed" }, { status: 500 });
  }
}
