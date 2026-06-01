import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Props {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const { status, trackingNumber, adminNotes } = await req.json();

    const order = await prisma.order.update({
      where: { id },
      data: {
        status,
        trackingNumber: trackingNumber || null,
        adminNotes:     adminNotes || null,
      },
    });

    return NextResponse.json({ ok: true, orderNumber: order.orderNumber });
  } catch (error) {
    console.error("Admin order update error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
