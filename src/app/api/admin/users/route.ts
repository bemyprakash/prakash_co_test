import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;

    if (role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { name, email, password, role: newRole } = await req.json();

    if (!name || !email || !password || !newRole) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const existingAdmin = await prisma.admin.findUnique({ where: { email } });
    if (existingAdmin) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await prisma.admin.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: newRole,
      },
    });

    return NextResponse.json({ message: "Admin created", admin: { id: newAdmin.id, email: newAdmin.email } }, { status: 201 });
  } catch (error) {
    console.error("Add Admin Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;

    if (role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Admin ID required" }, { status: 400 });
    }

    // Prevent deleting oneself
    if ((session?.user as any)?.id === id) {
       return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
    }

    await prisma.admin.delete({ where: { id } });

    return NextResponse.json({ message: "Admin deleted" }, { status: 200 });
  } catch (error) {
    console.error("Delete Admin Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
