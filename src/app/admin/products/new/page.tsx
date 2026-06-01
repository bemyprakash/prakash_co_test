import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Add New Product" };
export const revalidate = 0;

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="p-6 lg:p-8">
      <ProductForm categories={JSON.parse(JSON.stringify(categories))} mode="create" />
    </div>
  );
}
