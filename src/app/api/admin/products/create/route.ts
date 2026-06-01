import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { variants, categoryId, ...productData } = data;

    // Check slug uniqueness
    const existing = await prisma.product.findUnique({
      where: { slug: productData.slug },
    });

    if (existing) {
      return NextResponse.json({ error: "A product with this SEO slug already exists" }, { status: 400 });
    }

    const imagesPlaceholder = JSON.stringify(["/products/placeholder.jpg"]);

    // Create product in the database
    const product = await prisma.product.create({
      data: {
        ...productData,
        images: imagesPlaceholder,
        category: {
          connect: { id: categoryId },
        },
        variants: variants && variants.length > 0 ? {
          create: variants.map((v: any) => ({
            label:             v.label,
            price:             v.price,
            comparePrice:      v.comparePrice || null,
            stock:             v.stock,
            lowStockThreshold: v.lowStockThreshold,
            sku:               v.sku || null,
            isActive:          true,
          })),
        } : undefined,
      },
    });

    return NextResponse.json({ ok: true, id: product.id });
  } catch (error) {
    console.error("Admin product creation error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
