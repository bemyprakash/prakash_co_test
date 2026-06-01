"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ShoppingCart, Star, ArrowRight } from "lucide-react";
import { HeritageDivider } from "@/components/heritage/HeritageDivider";
import { formatPrice } from "@/lib/utils";

// Static placeholder products — will be replaced with DB data
const FEATURED_PRODUCTS = [
  {
    id: "1",
    name: "Darjeeling First Flush Tea",
    slug: "darjeeling-first-flush-tea",
    category: "Tea & Coffee",
    price: 450,
    comparePrice: 550,
    rating: 4.9,
    reviewCount: 128,
    badge: "Bestseller",
    badgeColor: "brand",
    variants: ["100g", "250g", "500g"],
    bgColor: "#EAF8F0",
  },
  {
    id: "2",
    name: "Himalayan Wildflower Honey Jam",
    slug: "himalayan-wildflower-honey-jam",
    category: "Jams & Preserves",
    price: 280,
    comparePrice: null,
    rating: 4.8,
    reviewCount: 74,
    badge: "New Arrival",
    badgeColor: "gold",
    variants: ["250g", "500g"],
    bgColor: "#FAF8F2",
  },
  {
    id: "3",
    name: "Heritage Blend Roasted Coffee",
    slug: "heritage-blend-coffee",
    category: "Tea & Coffee",
    price: 380,
    comparePrice: 420,
    rating: 4.7,
    reviewCount: 96,
    badge: "Fan Favourite",
    badgeColor: "brand",
    variants: ["200g", "400g"],
    bgColor: "#EAF8F0",
  },
  {
    id: "4",
    name: "Artisan Cheese Selection",
    slug: "artisan-cheese-selection",
    category: "Cheese & Dairy",
    price: 620,
    comparePrice: null,
    rating: 4.9,
    reviewCount: 42,
    badge: "Premium",
    badgeColor: "gold",
    variants: ["200g"],
    bgColor: "#FAF8F2",
  },
];

export function FeaturedProducts() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      className="section-padding"
      style={{ background: "var(--cream)" }}
      aria-label="Featured Products"
    >
      <div className="container-heritage">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div className="space-y-3">
            <span className="badge-heritage">Our Favourites</span>
            <h2 className="font-serif text-heading-xl text-charcoal">
              Featured Products
            </h2>
            <HeritageDivider color="gold" size="sm" className="justify-start" />
          </div>
          <Link
            href="/shop"
            className="btn-secondary self-start md:self-auto group flex-shrink-0"
          >
            View All Products
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_PRODUCTS.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface ProductCardProps {
  product: typeof FEATURED_PRODUCTS[0];
}

function ProductCard({ product }: ProductCardProps) {
  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null;

  return (
    <div className="card-heritage group flex flex-col h-full overflow-hidden">
      {/* Image Area */}
      <div
        className="relative aspect-square flex items-center justify-center overflow-hidden"
        style={{ background: product.bgColor }}
      >
        {/* Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className="text-[10px] font-semibold px-2 py-1 rounded-sm tracking-wide uppercase"
            style={{
              background: product.badgeColor === "gold" ? "var(--gold)" : "var(--brand-primary)",
              color: "white",
            }}
          >
            {product.badge}
          </span>
        </div>

        {/* Discount badge */}
        {discount && (
          <div className="absolute top-3 right-3 z-10">
            <span className="text-[10px] font-bold px-2 py-1 bg-red-500 text-white rounded-sm">
              -{discount}%
            </span>
          </div>
        )}

        {/* Product placeholder */}
        <div className="text-center p-6">
          <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-3"
            style={{ background: "rgba(10,155,75,0.1)" }}>
            <span className="text-3xl">🍃</span>
          </div>
          <p className="font-heritage text-xs text-muted uppercase tracking-widest">
            {product.category}
          </p>
        </div>

        {/* Quick add overlay */}
        <div className="absolute inset-0 bg-brand-deep/0 group-hover:bg-brand-deep/5 transition-colors duration-300" />
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div>
          <p className="text-[11px] text-muted uppercase tracking-wider mb-1">{product.category}</p>
          <Link href={`/shop/${product.slug}`}>
            <h3 className="font-serif text-sm font-semibold text-charcoal leading-snug hover:text-brand-primary transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, j) => (
              <Star
                key={j}
                className="w-3 h-3"
                style={{
                  fill: j < Math.round(product.rating) ? "var(--gold)" : "transparent",
                  color: "var(--gold)",
                }}
              />
            ))}
          </div>
          <span className="text-[11px] text-muted">({product.reviewCount})</span>
        </div>

        {/* Variants */}
        <div className="flex flex-wrap gap-1.5">
          {product.variants.map((v) => (
            <span
              key={v}
              className="text-[10px] px-2 py-0.5 border rounded-sm font-medium cursor-pointer hover:border-brand-primary hover:text-brand-primary transition-colors"
              style={{ borderColor: "var(--border)", color: "var(--muted)" }}
            >
              {v}
            </span>
          ))}
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div>
            <span className="font-semibold text-base text-charcoal">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && (
              <span className="text-xs text-muted line-through ml-1.5">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-sm transition-all"
            style={{
              background: "var(--brand-primary)",
              color: "white",
            }}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
