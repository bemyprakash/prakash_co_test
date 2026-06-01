import { prisma } from "@/lib/prisma";
import { AdminManagerClient } from "./AdminManagerClient";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminsPage() {
  const session = await auth();
  const role = (session?.user as any)?.role;

  if (role !== "SUPER_ADMIN") {
    redirect("/admin");
  }

  const admins = await prisma.admin.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-serif text-charcoal">Admin Management</h1>
        <p className="text-sm text-muted">Add or remove administrators from the platform.</p>
      </div>
      <AdminManagerClient initialAdmins={admins} currentUserId={(session?.user as any)?.id} />
    </div>
  );
}
