import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { productId, rating, comment } = body;

    if (!productId || !rating || !comment) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Since we are adding reviews to a specific product
    // Wait, let's check the schema to see if Review has userId, productId, rating, text
    // I can just upsert or create
    const review = await prisma.review.create({
      data: {
        rating,
        body: comment,
        productId,
        userId,
      },
    });

    return NextResponse.json({ message: "Review created successfully", review }, { status: 201 });
  } catch (error) {
    console.error("Create Review Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
