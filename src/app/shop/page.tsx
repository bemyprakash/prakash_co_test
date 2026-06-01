import { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShopClient } from "@/components/shop/ShopClient";
import { HeritageDivider } from "@/components/heritage/HeritageDivider";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Collection",
  description:
    "Browse our full collection of premium teas, coffees, jams, cheese, confectionery and souvenir items. Heritage quality since 1928.",
};

interface Props {
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: string;
  }>;
}

export default async function ShopPage({ searchParams }: Props) {
  const { q, category, sort } = await searchParams;

  // 1. Fetch categories
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  // 2. Build where filter for products
  const where: any = {
    isActive: true,
  };

  if (q) {
    where.OR = [
      { name: { contains: q } },
      { shortDesc: { contains: q } },
      { description: { contains: q } },
    ];
  }

  if (category) {
    where.category = {
      slug: category,
    };
  }

  // 3. Build order query for products
  let orderBy: any = {};
  if (sort === "price-asc") {
    orderBy = { basePrice: "asc" };
  } else if (sort === "price-desc") {
    orderBy = { basePrice: "desc" };
  } else if (sort === "newest") {
    orderBy = { createdAt: "desc" };
  } else if (sort === "rating") {
    orderBy = { isBestseller: "desc" }; // fallback
  } else {
    orderBy = { isFeatured: "desc" }; // default / featured
  }

  // 4. Fetch products matching filters
  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      category: true,
      variants: {
        where: { isActive: true },
      },
    },
  });

  return (
    <>
      <Navbar />
      <main>
        {/* Page Header */}
        <div
          className="py-14 text-center"
          style={{ background: "var(--cream)", borderBottom: "1px solid rgba(10,155,75,0.1)" }}
        >
          <div className="container-heritage space-y-3">
            <span className="badge-heritage">Our Collection</span>
            <h1 className="font-serif text-heading-xl text-charcoal">Shop</h1>
            <p className="text-muted max-w-md mx-auto text-sm">
              Curated heritage products — every item chosen with care since 1928.
            </p>
            <div className="flex justify-center mt-4">
              <HeritageDivider color="gold" size="sm" />
            </div>
          </div>
        </div>

        {/* Shop Content */}
        <Suspense fallback={<ShopSkeleton />}>
          <ShopClient
            initialProducts={JSON.parse(JSON.stringify(products))}
            categories={JSON.parse(JSON.stringify(categories))}
          />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

function ShopSkeleton() {
  return (
    <div className="container-heritage py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-sm overflow-hidden animate-pulse">
            <div className="aspect-square bg-gray-100" />
            <div className="p-4 space-y-2">
              <div className="h-3 bg-gray-100 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
