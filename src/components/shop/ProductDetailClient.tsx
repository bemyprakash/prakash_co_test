"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Star, ShoppingCart, ShieldCheck, Truck, RefreshCw, Calendar, MapPin, Sparkles, Plus, Minus, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
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
  ingredients: string | null;
  shelfLife: string | null;
  origin: string | null;
  hsnCode: string | null;
  gstPercent: string | null;
  isActive: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  stock: number;
  lowStockThreshold: number;
  category: Category;
  variants: Variant[];
}

interface Props {
  product: Product;
}

export function ProductDetailClient({ product }: Props) {
  const imagesArray = (() => {
    try {
      return JSON.parse(product.images) as string[];
    } catch {
      return [];
    }
  })();

  const { data: session } = useSession();
  const [selectedImage, setSelectedImage] = useState(imagesArray[0] || "");
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    product.variants.length > 0 ? product.variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "details" | "reviews">("desc");
  const [reviews, setReviews] = useState<Array<{ name: string; rating: number; date: string; body: string }>>([
    {
      name: "Ramesh Sen",
      rating: 5,
      date: "May 12, 2026",
      body: "This takes me back to my summers in Darjeeling. The aroma is incredibly authentic and fresh. The packaging has that beautiful since-1928 premium feel. Worth every rupee."
    },
    {
      name: "Meera Patel",
      rating: 5,
      date: "April 28, 2026",
      body: "Absolutely delicious! Excellent customer service and fast shipping. Highly recommended."
    }
  ]);
  
  // Guest Review Submission State
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewBody, setNewReviewBody] = useState("");

  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error("Please login to submit a review.");
      return;
    }
    if (!newReviewBody.trim()) {
      toast.error("Please enter a review comment.");
      return;
    }
    
    setIsSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          rating: newReviewRating,
          comment: newReviewBody,
        }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit review");

      const dateObj = new Date();
    const formattedDate = dateObj.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
    setReviews([
      {
        name: newReviewName,
        rating: newReviewRating,
        date: formattedDate,
        body: newReviewBody
      },
      ...reviews
    ]);
    setNewReviewName("");
    setNewReviewRating(5);
    setNewReviewBody("");
    toast.success("Thank you! Your review has been added successfully.");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Determine current pricing and stock
  const price = selectedVariant ? Number(selectedVariant.price) : Number(product.basePrice);
  const comparePrice = selectedVariant
    ? selectedVariant.comparePrice ? Number(selectedVariant.comparePrice) : null
    : product.comparePrice ? Number(product.comparePrice) : null;
  const stock = selectedVariant ? selectedVariant.stock : product.stock;
  const sku = selectedVariant ? selectedVariant.sku : product.sku;

  const discount = comparePrice ? Math.round(((comparePrice - price) / comparePrice) * 100) : null;

  const handleAddToCart = () => {
    const stored = localStorage.getItem("prakashco_cart");
    let cart = [];
    if (stored) {
      try {
        cart = JSON.parse(stored);
      } catch {
        cart = [];
      }
    }

    const cartItemId = selectedVariant ? selectedVariant.id : product.id;
    const cartItemName = product.name;
    const cartItemVariant = selectedVariant ? selectedVariant.label : product.weight;
    const cartItemPrice = price;
    const cartItemImage = imagesArray[0] || "";

    const existingIndex = cart.findIndex((i: any) => i.id === cartItemId);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: cartItemId,
        name: cartItemName,
        variant: cartItemVariant || undefined,
        price: cartItemPrice,
        quantity: quantity,
        image: cartItemImage,
      });
    }

    localStorage.setItem("prakashco_cart", JSON.stringify(cart));
    
    // Notify Navbar to update badge count
    window.dispatchEvent(new Event("cart-updated"));
    
    toast.success(`${product.name} (${cartItemVariant || "Standard"}) added to cart!`);
  };

  return (
    <section className="py-12 bg-white" style={{ minHeight: "80vh" }}>
      <div className="container-heritage">
        {/* Breadcrumbs */}
        <nav className="flex gap-2 text-xs text-muted mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-brand-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-brand-primary transition-colors">Shop</Link>
          <span>/</span>
          <Link href={`/shop?category=${product.category.slug}`} className="hover:text-brand-primary transition-colors">
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-charcoal font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Product Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 mb-16">
          {/* Left Column - Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div
              className="relative aspect-square flex items-center justify-center rounded-sm overflow-hidden border"
              style={{ background: "var(--cream)", borderColor: "rgba(10,155,75,0.1)" }}
            >
              {discount && (
                <span className="absolute top-4 right-4 z-10 text-xs font-bold px-2.5 py-1 bg-red-500 text-white rounded-sm shadow-sm">
                  -{discount}% OFF
                </span>
              )}
              {product.isBestseller && (
                <span className="absolute top-4 left-4 z-10 text-[10px] font-semibold px-2.5 py-1 text-white rounded-sm tracking-wide uppercase shadow-sm"
                  style={{ background: "var(--brand-primary)" }}>
                  ★ Bestseller
                </span>
              )}

              {selectedImage ? (
                <div className="text-8xl">🍃</div> // Visual placeholder for images
              ) : (
                <div className="text-8xl">🍃</div>
              )}
            </div>

            {/* Thumbnails (for multiple images in high tier) */}
            {imagesArray.length > 1 && (
              <div className="flex gap-3">
                {imagesArray.map((img) => (
                  <button
                    key={img}
                    onClick={() => setSelectedImage(img)}
                    className="w-20 h-20 rounded-sm border overflow-hidden flex items-center justify-center transition-all bg-cream"
                    style={{
                      borderColor: selectedImage === img ? "var(--brand-primary)" : "rgba(10,155,75,0.1)",
                      borderWidth: selectedImage === img ? "2px" : "1px"
                    }}
                  >
                    <span className="text-2xl">🍃</span>
                  </button>
                ))}
              </div>
            )}

            {/* Trust Elements Grid */}
            <div className="grid grid-cols-3 gap-3 pt-6 text-center">
              <div className="p-3 bg-cream rounded-sm border" style={{ borderColor: "rgba(10,155,75,0.05)" }}>
                <Truck className="w-5 h-5 mx-auto mb-1" style={{ color: "var(--brand-primary)" }} />
                <p className="text-[10px] font-serif font-bold text-charcoal">Free Shipping</p>
                <p className="text-[9px] text-muted">On orders &gt; ₹500</p>
              </div>
              <div className="p-3 bg-cream rounded-sm border" style={{ borderColor: "rgba(10,155,75,0.05)" }}>
                <ShieldCheck className="w-5 h-5 mx-auto mb-1" style={{ color: "var(--brand-primary)" }} />
                <p className="text-[10px] font-serif font-bold text-charcoal">Secure Payment</p>
                <p className="text-[9px] text-muted">Razorpay Verified</p>
              </div>
              <div className="p-3 bg-cream rounded-sm border" style={{ borderColor: "rgba(10,155,75,0.05)" }}>
                <RefreshCw className="w-5 h-5 mx-auto mb-1" style={{ color: "var(--brand-primary)" }} />
                <p className="text-[10px] font-serif font-bold text-charcoal">Legacy Trust</p>
                <p className="text-[9px] text-muted">Since 1928 Heritage</p>
              </div>
            </div>
          </div>

          {/* Right Column - Product Meta & Actions */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            {/* Badges & Category */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge-heritage">{product.category.name}</span>
              {product.isFeatured && (
                <span className="text-[10px] font-medium border px-2 py-0.5 rounded-sm tracking-wide"
                  style={{ borderColor: "var(--gold)", color: "var(--gold)", background: "rgba(201,162,74,0.05)" }}>
                  ✨ Pure Reserve
                </span>
              )}
            </div>

            {/* Title */}
            <div className="space-y-1">
              <h1 className="font-serif text-heading-xl text-charcoal leading-tight">{product.name}</h1>
              <p className="text-xs text-muted tracking-widest font-mono uppercase">SKU: {sku || "PENDING"}</p>
            </div>

            {/* Reviews summary */}
            <div className="flex items-center gap-2 py-1 border-y border-brand-light">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" style={{ color: "var(--gold)", fill: "var(--gold)" }} />
                ))}
              </div>
              <span className="text-xs text-charcoal font-medium">{reviews.length} Customer Reviews</span>
              <span className="text-muted text-xs">|</span>
              <span className="text-xs text-brand-primary font-serif font-semibold">100% Quality Guaranteed</span>
            </div>

            {/* Price section */}
            <div className="bg-cream rounded-sm p-4 border" style={{ borderColor: "rgba(10,155,75,0.08)" }}>
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl font-bold" style={{ color: "var(--brand-primary)" }}>
                  {formatPrice(price)}
                </span>
                {comparePrice && (
                  <span className="text-base text-muted line-through">
                    {formatPrice(comparePrice)}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-muted mt-1">Inclusive of all local taxes + 5% GST calculated at checkout</p>
            </div>

            {/* Short Desc */}
            {product.shortDesc && (
              <p className="text-sm text-charcoal leading-relaxed">{product.shortDesc}</p>
            )}

            {/* Variants Selector */}
            {product.variants.length > 0 && (
              <div className="space-y-2.5">
                <p className="text-xs font-serif font-bold text-charcoal uppercase tracking-wider">Select Size/Weight:</p>
                <div className="flex flex-wrap gap-2.5">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSelectedVariant(v);
                        setQuantity(1);
                      }}
                      className="px-4 py-2 border text-sm rounded-sm font-medium transition-all"
                      style={{
                        borderColor: selectedVariant?.id === v.id ? "var(--brand-primary)" : "var(--border)",
                        background: selectedVariant?.id === v.id ? "var(--brand-light)" : "transparent",
                        color: selectedVariant?.id === v.id ? "var(--brand-primary)" : "var(--charcoal)",
                      }}
                    >
                      {v.label} — {formatPrice(Number(v.price))}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Inventory / Stock status */}
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${stock > 0 ? "bg-green-500" : "bg-red-500 animate-pulse"}`} />
              <span className="text-xs font-semibold text-charcoal">
                {stock > 5 ? (
                  <span className="text-green-600">In Stock (Dispatch within 24 hours)</span>
                ) : stock > 0 ? (
                  <span className="text-amber-600">Only {stock} items left in stock — order soon!</span>
                ) : (
                  <span className="text-red-500">Out of stock (Restocking soon)</span>
                )}
              </span>
            </div>

            {/* Quantity and Checkout actions */}
            {stock > 0 && (
              <div className="flex gap-4 items-center pt-2">
                {/* Quantity Controls */}
                <div
                  className="flex items-center gap-4 rounded-sm border"
                  style={{ borderColor: "rgba(10,155,75,0.2)" }}
                >
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-brand-light transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-serif font-bold text-charcoal w-6 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-brand-light transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart button */}
                <button
                  onClick={handleAddToCart}
                  className="btn-primary flex-1 py-3 px-6 text-sm justify-center gap-2 h-10"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart — {formatPrice(price * quantity)}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Story, details, and review Tabs */}
        <div className="border-t border-brand-light pt-10">
          {/* Tabs Bar */}
          <div className="flex border-b border-gray-100 gap-6 mb-8 overflow-x-auto">
            {[
              { id: "desc", label: "Product Description" },
              { id: "details", label: "Specifications & Details" },
              { id: "reviews", label: `Customer Reviews (${reviews.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className="py-3 text-sm font-serif font-semibold border-b-2 transition-all whitespace-nowrap"
                style={{
                  borderColor: activeTab === tab.id ? "var(--brand-primary)" : "transparent",
                  color: activeTab === tab.id ? "var(--brand-primary)" : "var(--muted)",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          <div className="min-h-[200px]">
            {activeTab === "desc" && (
              <div className="space-y-4 max-w-3xl">
                <h3 className="font-serif text-lg font-bold text-charcoal">The Legend of A. Prakash & Co.</h3>
                <p className="text-sm text-charcoal leading-relaxed whitespace-pre-line">{product.description}</p>
                <div className="mt-6 p-4 rounded-sm border bg-cream" style={{ borderColor: "var(--gold)" }}>
                  <p className="text-xs font-serif italic text-charcoal">
                    "Since 1928, our family business has committed itself to sourcing only the finest culinary delights. Each batch of tea leaf, coffee bean, and conserve is selected with our historic legacy of trust in mind."
                  </p>
                </div>
              </div>
            )}

            {activeTab === "details" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl text-sm">
                <div className="space-y-4">
                  <h4 className="font-serif text-base font-bold text-charcoal">Product Specifications</h4>
                  <div className="space-y-2.5">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Place of Origin</span>
                      <span className="font-medium text-charcoal">{product.origin || "Darjeeling"}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Shelf Life</span>
                      <span className="font-medium text-charcoal">{product.shelfLife || "12 Months"}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> Weight</span>
                      <span className="font-medium text-charcoal">{selectedVariant ? selectedVariant.label : product.weight || "Standard"}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-serif text-base font-bold text-charcoal">Ingredients & Compliance</h4>
                  <div className="space-y-2.5">
                    <div className="border-b pb-2">
                      <p className="text-muted mb-1">Ingredients List</p>
                      <p className="font-medium text-charcoal text-xs leading-relaxed">{product.ingredients || "All natural premium ingredients."}</p>
                    </div>
                    <div className="flex justify-between border-b pb-2 text-xs">
                      <span className="text-muted">HSN Code (GST Regulation)</span>
                      <span className="font-mono font-medium text-charcoal">{product.hsnCode || "0902"}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2 text-xs">
                      <span className="text-muted">GST Tax Rate</span>
                      <span className="font-medium text-charcoal">{product.gstPercent ? `${product.gstPercent}%` : "5%"}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Reviews List */}
                <div className="lg:col-span-7 space-y-6">
                  <h4 className="font-serif text-base font-bold text-charcoal">Customer Reviews</h4>
                  {reviews.length === 0 ? (
                    <p className="text-sm text-muted">No reviews yet for this product. Be the first to share your experience!</p>
                  ) : (
                    <div className="space-y-5">
                      {reviews.map((rev, index) => (
                        <div
                          key={index}
                          className="bg-cream rounded-sm p-5 border"
                          style={{ borderColor: "rgba(10,155,75,0.06)" }}
                        >
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <div>
                              <p className="font-serif font-bold text-charcoal text-sm">{rev.name}</p>
                              <span className="text-[10px] text-muted">{rev.date}</span>
                            </div>
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, rIdx) => (
                                <Star
                                  key={rIdx}
                                  className="w-3.5 h-3.5 fill-gold text-gold"
                                  style={{ color: "var(--gold)", fill: rIdx < rev.rating ? "var(--gold)" : "transparent" }}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-charcoal leading-relaxed">{rev.body}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submission Form */}
                <div className="lg:col-span-5">
                  <div
                    className="bg-white rounded-sm p-6 border"
                    style={{ borderColor: "rgba(10,155,75,0.15)", background: "var(--cream)" }}
                  >
                    <h4 className="font-serif text-base font-bold text-charcoal mb-4">Write a Review</h4>
                    {!session ? (
                      <div className="text-center py-6">
                        <p className="text-sm text-muted mb-4">You must be logged in to leave a review.</p>
                        <Link href="/login" className="btn-primary py-2 px-6 text-xs inline-block">
                          Log In to Review
                        </Link>
                      </div>
                    ) : (
                      <form onSubmit={handleAddReview} className="space-y-4">
                        <div>
                          <label className="block text-xs font-serif font-semibold text-charcoal uppercase mb-1">Rating *</label>
                          <select
                            value={newReviewRating}
                            onChange={(e) => setNewReviewRating(Number(e.target.value))}
                            className="input-heritage text-xs cursor-pointer w-full"
                          >
                            <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                            <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                            <option value={3}>⭐⭐⭐ (3 Stars)</option>
                            <option value={2}>⭐⭐ (2 Stars)</option>
                            <option value={1}>⭐ (1 Star)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-serif font-semibold text-charcoal uppercase mb-1">Review comment *</label>
                          <textarea
                            required
                            value={newReviewBody}
                            onChange={(e) => setNewReviewBody(e.target.value)}
                            placeholder="Tell us about the flavour, aroma, and packaging quality..."
                            rows={4}
                            className="input-heritage text-xs w-full"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmittingReview}
                          className="btn-primary w-full justify-center text-xs py-2.5 flex items-center gap-2"
                        >
                          {isSubmittingReview && <Loader2 className="w-4 h-4 animate-spin" />}
                          Submit Review
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
