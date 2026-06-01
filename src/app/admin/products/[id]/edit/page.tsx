import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Edit Product" };
export const revalidate = 0;

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      variants: {
        where: { isActive: true },
        orderBy: { price: "asc" },
      },
    },
  });

  if (!product) {
    notFound();
  }

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="p-6 lg:p-8">
      <ProductForm
        categories={JSON.parse(JSON.stringify(categories))}
        initialData={JSON.parse(JSON.stringify(product))}
        mode="edit"
      />
    </div>
  );
}
