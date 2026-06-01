import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Props {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const data = await req.json();
    const { variants, categoryId, ...productData } = data;

    // Use Prisma transaction for absolute consistency
    const result = await prisma.$transaction(async (tx) => {
      // 1. Update product overview fields
      const updatedProduct = await tx.product.update({
        where: { id },
        data: {
          ...productData,
          category: {
            connect: { id: categoryId },
          },
        },
      });

      // 2. Clear old variants of this product
      await tx.productVariant.deleteMany({
        where: { productId: id },
      });

      // 3. Create fresh variants list if provided
      if (variants && variants.length > 0) {
        await tx.productVariant.createMany({
          data: variants.map((v: any) => ({
            productId:         id,
            label:             v.label,
            price:             v.price,
            comparePrice:      v.comparePrice || null,
            stock:             v.stock,
            lowStockThreshold: v.lowStockThreshold,
            sku:               v.sku || null,
            isActive:          true,
          })),
        });
      }

      return updatedProduct;
    });

    return NextResponse.json({ ok: true, id: result.id });
  } catch (error) {
    console.error("Admin product update error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}
