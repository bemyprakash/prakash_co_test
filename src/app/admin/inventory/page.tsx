import { prisma } from "@/lib/prisma";
import { InventoryClient } from "./InventoryClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Manage Inventory" };
export const revalidate = 0;

export default async function AdminInventoryPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    include: {
      category: true,
      variants: {
        where: { isActive: true },
        orderBy: { price: "asc" },
      },
    },
  });

  return (
    <div className="p-6 lg:p-8">
      <InventoryClient initialProducts={JSON.parse(JSON.stringify(products))} />
    </div>
  );
}
