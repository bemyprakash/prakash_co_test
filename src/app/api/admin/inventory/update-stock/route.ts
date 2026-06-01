import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { type, id, stock } = await req.json();

    if (type === "product") {
      await prisma.product.update({
        where: { id },
        data: { stock: Number(stock) },
      });
    } else if (type === "variant") {
      await prisma.productVariant.update({
        where: { id },
        data: { stock: Number(stock) },
      });
    } else {
      return NextResponse.json({ error: "Invalid inventory type" }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin inventory update stock error:", error);
    return NextResponse.json({ error: "Failed to update stock level" }, { status: 500 });
  }
}
