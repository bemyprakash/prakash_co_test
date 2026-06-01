import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OrderDetailClient } from "./OrderDetailClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Manage Order Details" };
export const revalidate = 0;

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderPage({ params }: Props) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="p-6 lg:p-8">
      <OrderDetailClient order={JSON.parse(JSON.stringify(order))} />
    </div>
  );
}
