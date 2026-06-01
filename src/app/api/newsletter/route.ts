import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { isActive: true },
      create: { email, name },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
