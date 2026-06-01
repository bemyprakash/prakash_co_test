import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductDetailClient } from "@/components/shop/ProductDetailClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
  });

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  let imagesArray: string[] = [];
  try {
    imagesArray = JSON.parse(product.images as string) as string[];
  } catch {
    imagesArray = [];
  }
  const imageUrl = imagesArray[0] || "/og-image.jpg";

  return {
    title: product.metaTitle || `${product.name} | A. Prakash & Co.`,
    description: product.metaDescription || product.shortDesc || "Premium heritage product from A. Prakash & Co., Since 1928.",
    openGraph: {
      title: product.name,
      description: product.shortDesc || undefined,
      images: [{ url: imageUrl }],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
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

  // Generate dynamic Product Schema
  let imagesArray: string[] = [];
  try {
    imagesArray = JSON.parse(product.images as string) as string[];
  } catch {
    imagesArray = [];
  }

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": imagesArray,
    "description": product.shortDesc || product.description,
    "sku": product.sku || undefined,
    "mpn": product.sku || undefined,
    "brand": {
      "@type": "Brand",
      "name": "A. Prakash & Co."
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "INR",
      "lowPrice": product.variants.length > 0 ? Number(product.variants[0].price) : Number(product.basePrice),
      "highPrice": product.variants.length > 0 ? Number(product.variants[product.variants.length - 1].price) : Number(product.basePrice),
      "offerCount": product.variants.length || 1,
      "availability": product.stock > 0 || product.variants.some(v => v.stock > 0) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <Navbar />
      <main>
        <ProductDetailClient product={JSON.parse(JSON.stringify(product))} />
      </main>
      <Footer />
    </>
  );
}
