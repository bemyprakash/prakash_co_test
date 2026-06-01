"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, X, ChevronDown, ShoppingCart, Star } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Variant {
  id: string;
  label: string;
  price: string;
  comparePrice: string | null;
  stock: number;
  sku: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc: string | null;
  basePrice: string;
  comparePrice: string | null;
  images: string;
  sku: string | null;
  weight: string | null;
  isActive: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  stock: number;
  category: Category;
  variants: Variant[];
}

interface ShopClientProps {
  initialProducts: Product[];
  categories: Category[];
}

const SORT_OPTIONS = [
  { label: "Featured",       value: "featured" },
  { label: "Price: Low-High",value: "price-asc" },
  { label: "Price: High-Low",value: "price-desc" },
  { label: "Newest First",   value: "newest" },
  { label: "Best Rated",     value: "rating" },
];

export function ShopClient({ initialProducts, categories }: ShopClientProps) {
  const searchParams  = useSearchParams();
  const router        = useRouter();

  const [search,    setSearch]    = useState(searchParams.get("q") || "");
  const [category,  setCategory]  = useState(searchParams.get("category") || "");
  const [sort,      setSort]      = useState(searchParams.get("sort") || "featured");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page,      setPage]      = useState(1);

  const PER_PAGE = 8;

  // Sync state with URL params changes
  useEffect(() => {
    setSearch(searchParams.get("q") || "");
    setCategory(searchParams.get("category") || "");
    setSort(searchParams.get("sort") || "featured");
    setPage(1);
  }, [searchParams]);

  const paginated  = initialProducts.slice(0, page * PER_PAGE);
  const hasMore    = paginated.length < initialProducts.length;

  // Sync params to URL
  const updateParam = useCallback((key: string, val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val) params.set(key, val); else params.delete(key);
    router.push(`/shop?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  return (
    <section className="section-padding bg-white">
      <div className="container-heritage">
        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="search"
              placeholder="Search products…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                updateParam("q", e.target.value);
              }}
              className="input-heritage pl-10 pr-4"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                updateParam("sort", e.target.value);
              }}
              className="input-heritage pr-8 appearance-none cursor-pointer min-w-[180px]"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
          </div>

          {/* Filter toggle mobile */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="md:hidden flex items-center gap-2 btn-secondary py-2.5"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters — desktop */}
          <aside className="hidden md:block w-52 flex-shrink-0">
            <FilterPanel
              category={category}
              categories={categories}
              onCategory={(v) => {
                setCategory(v);
                updateParam("category", v);
              }}
            />
          </aside>

          {/* Mobile Filter Panel */}
          {filtersOpen && (
            <div className="fixed inset-0 z-50 bg-black/40 md:hidden" onClick={() => setFiltersOpen(false)}>
              <div
                className="absolute left-0 top-0 bottom-0 w-72 bg-white p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-serif text-lg">Filters</h3>
                  <button onClick={() => setFiltersOpen(false)}><X className="w-5 h-5" /></button>
                </div>
                <FilterPanel
                  category={category}
                  categories={categories}
                  onCategory={(v) => {
                    setCategory(v);
                    updateParam("category", v);
                    setFiltersOpen(false);
                  }}
                />
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="flex-1">
            {/* Visual Categories Header */}
            <div className="flex flex-wrap gap-3 mb-8">
              <button
                onClick={() => { setCategory(""); updateParam("category", ""); }}
                className={cn(
                  "px-4 py-2 text-[15px] font-medium rounded-[8px] transition-colors border",
                  category === "" 
                    ? "bg-brand-primary text-white border-brand-primary shadow-sm" 
                    : "bg-white text-charcoal border-gray-200 hover:border-brand-primary hover:text-brand-primary"
                )}
              >
                All Products
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setCategory(cat.slug); updateParam("category", cat.slug); }}
                  className={cn(
                    "px-4 py-2 text-[15px] font-medium rounded-[8px] transition-colors border",
                    category === cat.slug 
                      ? "bg-brand-primary text-white border-brand-primary shadow-sm" 
                      : "bg-white text-charcoal border-gray-200 hover:border-brand-primary hover:text-brand-primary"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Result count */}
            <p className="text-sm text-muted mb-6">
              Showing <span className="font-medium text-charcoal">{initialProducts.length}</span> products
              {category && <> in <span className="font-medium text-brand-primary">{categories.find(c => c.slug === category)?.name}</span></>}
              {search && <> for &ldquo;<span className="font-medium text-brand-primary">{search}</span>&rdquo;</>}
            </p>

            {initialProducts.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <p className="font-serif text-xl text-charcoal">No products found</p>
                <p className="text-muted text-sm">Try a different search or category</p>
                <button
                  onClick={() => {
                    setSearch("");
                    setCategory("");
                    router.push("/shop");
                  }}
                  className="btn-secondary mt-4"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {paginated.map((product) => (
                    <ShopProductCard key={product.id} product={product} />
                  ))}
                </div>

                {hasMore && (
                  <div className="text-center mt-10">
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      className="btn-secondary"
                    >
                      Load More
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

interface FilterPanelProps {
  category: string;
  categories: Category[];
  onCategory: (v: string) => void;
}

function FilterPanel({ category, categories, onCategory }: FilterPanelProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-sm font-semibold text-charcoal mb-3 uppercase tracking-wider">
          Category
        </h3>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => onCategory("")}
              className={cn(
                "w-full text-left px-3 py-2 text-sm rounded-sm transition-colors",
                category === ""
                  ? "bg-brand-light text-brand-primary font-medium"
                  : "text-muted hover:bg-brand-light hover:text-brand-primary"
              )}
            >
              All Products
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => onCategory(cat.slug)}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm rounded-sm transition-colors",
                  category === cat.slug
                    ? "bg-brand-light text-brand-primary font-medium"
                    : "text-muted hover:bg-brand-light hover:text-brand-primary"
                )}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-serif text-sm font-semibold text-charcoal mb-3 uppercase tracking-wider">
          Availability
        </h3>
        <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
          <input type="checkbox" defaultChecked className="accent-brand-primary" />
          In Stock Only
        </label>
      </div>
    </div>
  );
}

interface ProductCardProps {
  product: Product;
}

function ShopProductCard({ product }: ProductCardProps) {
  const price = product.variants.length > 0 ? Number(product.variants[0].price) : Number(product.basePrice);
  const comparePrice = product.variants.length > 0
    ? product.variants[0].comparePrice ? Number(product.variants[0].comparePrice) : null
    : product.comparePrice ? Number(product.comparePrice) : null;

  const discount = comparePrice ? Math.round(((comparePrice - price) / comparePrice) * 100) : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const stored = localStorage.getItem("prakashco_cart");
    let cart = [];
    if (stored) {
      try {
        cart = JSON.parse(stored);
      } catch {
        cart = [];
      }
    }

    const selectedVariant = product.variants.length > 0 ? product.variants[0] : null;
    const cartItemId = selectedVariant ? selectedVariant.id : product.id;
    const cartItemName = product.name;
    const cartItemVariant = selectedVariant ? selectedVariant.label : product.weight;
    const cartItemPrice = price;

    let imagesArray: string[] = [];
    try {
      imagesArray = JSON.parse(product.images) as string[];
    } catch {
      imagesArray = [];
    }
    const cartItemImage = imagesArray[0] || "";

    const existingIndex = cart.findIndex((i: any) => i.id === cartItemId);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        id: cartItemId,
        name: cartItemName,
        variant: cartItemVariant || undefined,
        price: cartItemPrice,
        quantity: 1,
        image: cartItemImage,
      });
    }

    localStorage.setItem("prakashco_cart", JSON.stringify(cart));

    // Dispatch event for Navbar
    window.dispatchEvent(new Event("cart-updated"));

    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="card-heritage group flex flex-col h-full overflow-hidden">
      {/* Image */}
      <Link href={`/shop/${product.slug}`} className="block">
        <div
          className="relative aspect-square flex items-center justify-center overflow-hidden"
          style={{ background: "var(--brand-light)" }}
        >
          {product.isBestseller && (
            <span className="absolute top-3 left-3 z-10 text-[10px] font-semibold px-2 py-1 rounded-sm tracking-wide uppercase"
              style={{ background: "var(--brand-primary)", color: "white" }}>
              ★ Bestseller
            </span>
          )}
          {discount && (
            <span className="absolute top-3 right-3 z-10 text-[10px] font-bold px-2 py-1 bg-red-500 text-white rounded-sm">
              -{discount}%
            </span>
          )}
          <div className="text-5xl">🍃</div>
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <Link href={`/shop/${product.slug}`}>
          <h3 className="font-serif text-sm font-semibold text-charcoal hover:text-brand-primary transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1.5">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" style={{ color: "var(--gold)", fill: "var(--gold)" }} />
            ))}
          </div>
          <span className="text-[11px] text-muted">(24)</span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2">
          <div>
            <span className="font-semibold text-charcoal">{formatPrice(price)}</span>
            {comparePrice && (
              <span className="text-xs text-muted line-through ml-1.5">{formatPrice(comparePrice)}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer"
            style={{ background: "var(--brand-primary)", color: "white" }}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
