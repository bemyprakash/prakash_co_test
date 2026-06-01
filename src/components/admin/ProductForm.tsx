"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Save, Loader2, Sparkles } from "lucide-react";
import { slugify } from "@/lib/utils";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Variant {
  id?: string;
  label: string;
  price: string;
  comparePrice: string | null;
  stock: number;
  lowStockThreshold: number;
  sku: string | null;
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
  categoryId: string;
  variants: Variant[];
}

interface Props {
  categories: Category[];
  mode: "create" | "edit";
  initialData?: Product;
}

export function ProductForm({ categories, mode, initialData }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  // Core Form States
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [shortDesc, setShortDesc] = useState(initialData?.shortDesc || "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || (categories[0]?.id || ""));
  const [basePrice, setBasePrice] = useState(initialData?.basePrice || "0");
  const [comparePrice, setComparePrice] = useState(initialData?.comparePrice || "");
  
  // Specs States
  const [sku, setSku] = useState(initialData?.sku || "");
  const [weight, setWeight] = useState(initialData?.weight || "");
  const [ingredients, setIngredients] = useState(initialData?.ingredients || "");
  const [shelfLife, setShelfLife] = useState(initialData?.shelfLife || "");
  const [origin, setOrigin] = useState(initialData?.origin || "");
  const [hsnCode, setHsnCode] = useState(initialData?.hsnCode || "");
  const [gstPercent, setGstPercent] = useState(initialData?.gstPercent || "5");

  // Meta Flags States
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured ?? false);
  const [isBestseller, setIsBestseller] = useState(initialData?.isBestseller ?? false);

  // Single Stock States (ignored if variants present)
  const [stock, setStock] = useState(initialData?.stock ?? 0);
  const [lowStockThreshold, setLowStockThreshold] = useState(initialData?.lowStockThreshold ?? 5);

  // Variant States
  const [variants, setVariants] = useState<Variant[]>(initialData?.variants || []);

  // Auto-slugify name during creation
  useEffect(() => {
    if (mode === "create") {
      setSlug(slugify(name));
    }
  }, [name, mode]);

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      {
        label: "",
        price: basePrice,
        comparePrice: comparePrice || null,
        stock: 10,
        lowStockThreshold: 3,
        sku: sku ? `${sku}-${variants.length + 1}` : null,
      },
    ]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, idx) => idx !== index));
  };

  const handleVariantChange = (index: number, field: keyof Variant, value: any) => {
    const updated = [...variants];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setVariants(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug || !description) {
      toast.error("Please fill in all core fields (Name, Slug, Description).");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name,
        slug,
        description,
        shortDesc: shortDesc || null,
        categoryId,
        basePrice: parseFloat(basePrice) || 0,
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        sku: sku || null,
        weight: weight || null,
        ingredients: ingredients || null,
        shelfLife: shelfLife || null,
        origin: origin || null,
        hsnCode: hsnCode || null,
        gstPercent: parseFloat(gstPercent) || 5,
        isActive,
        isFeatured,
        isBestseller,
        stock: variants.length > 0 ? 0 : Number(stock),
        lowStockThreshold: Number(lowStockThreshold),
        variants: variants.map(v => ({
          ...v,
          price: parseFloat(v.price) || 0,
          comparePrice: v.comparePrice ? parseFloat(v.comparePrice) : null,
          stock: Number(v.stock),
          lowStockThreshold: Number(v.lowStockThreshold),
        })),
      };

      const url = mode === "create"
        ? "/api/admin/products/create"
        : `/api/admin/products/${initialData?.id}/update`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Operation failed");
      }

      toast.success(mode === "create" ? "Product created successfully! 🌟" : "Product updated successfully! 🌟");
      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/admin/products"
          className="flex items-center gap-1.5 text-xs text-muted hover:text-brand-primary transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalogue
        </Link>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary py-2 px-5 text-xs font-semibold flex items-center gap-1.5 cursor-pointer h-9"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {mode === "create" ? "Save Product" : "Update Product"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Columns - Inputs */}
        <div className="lg:col-span-8 space-y-6">
          {/* Core Info */}
          <div className="bg-white rounded-sm p-6 border border-gray-100 shadow-sm space-y-4">
            <h2 className="font-serif text-sm font-bold text-charcoal uppercase tracking-wider pb-2 border-b">
              Product Overview
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-serif font-bold text-charcoal uppercase tracking-wider mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.g., Darjeeling First Flush Tea"
                  className="input-heritage text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-serif font-bold text-charcoal uppercase tracking-wider mb-1">
                  SEO Slug *
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e-g-darjeeling-first-flush"
                  className="input-heritage text-xs"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-serif font-bold text-charcoal uppercase tracking-wider mb-1">
                  Short Summary (Max 500 chars)
                </label>
                <input
                  type="text"
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="Brief preview text visible on catalogue cards..."
                  maxLength={500}
                  className="input-heritage text-xs"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-serif font-bold text-charcoal uppercase tracking-wider mb-1">
                  Detailed Description *
                </label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide rich culinary histories and tea-making narratives..."
                  rows={6}
                  className="input-heritage text-xs"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Stock (Only visible if NO variants are created) */}
          {variants.length === 0 && (
            <div className="bg-white rounded-sm p-6 border border-gray-100 shadow-sm space-y-4">
              <h2 className="font-serif text-sm font-bold text-charcoal uppercase tracking-wider pb-2 border-b">
                Standard Pricing & Inventory
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-serif font-bold text-charcoal uppercase tracking-wider mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    placeholder="450"
                    className="input-heritage text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-serif font-bold text-charcoal uppercase tracking-wider mb-1">
                    Compare-at Original Price (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={comparePrice}
                    onChange={(e) => setComparePrice(e.target.value)}
                    placeholder="550"
                    className="input-heritage text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-serif font-bold text-charcoal uppercase tracking-wider mb-1">
                    Available Stock *
                  </label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    placeholder="50"
                    className="input-heritage text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-serif font-bold text-charcoal uppercase tracking-wider mb-1">
                    Low-Stock Alert Level *
                  </label>
                  <input
                    type="number"
                    required
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                    placeholder="5"
                    className="input-heritage text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Variant Editor */}
          <div className="bg-white rounded-sm p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <h2 className="font-serif text-sm font-bold text-charcoal uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-primary animate-pulse" /> Product Variants (Optional)
              </h2>
              <button
                type="button"
                onClick={handleAddVariant}
                className="btn-secondary py-1 px-3 text-[10px] flex items-center gap-1 bg-white cursor-pointer font-bold"
              >
                <Plus className="w-3 h-3" /> Add Variant
              </button>
            </div>
            
            {variants.length === 0 ? (
              <p className="text-xs text-muted leading-relaxed">
                No variants added. This item behaves as a single product. Create variants if you have multiple sizes/weights (e.g. 250g vs 500g).
              </p>
            ) : (
              <div className="space-y-4">
                <div className="text-[11px] text-muted bg-brand-light p-3 rounded-sm border border-brand-primary/20">
                  ⚠️ <strong>Notice:</strong> Standard price and stock fields above are hidden because active variants manage individual inventories!
                </div>
                
                <div className="space-y-3">
                  {variants.map((v, idx) => (
                    <div key={idx} className="bg-gray-50/50 p-4 border border-gray-100 rounded-sm grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                      <div className="sm:col-span-3">
                        <label className="block text-[10px] font-bold text-charcoal uppercase mb-0.5">Label (e.g. 250g) *</label>
                        <input
                          type="text"
                          required
                          value={v.label}
                          onChange={(e) => handleVariantChange(idx, "label", e.target.value)}
                          placeholder="250g"
                          className="input-heritage text-xs py-1.5"
                        />
                      </div>
                      
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-charcoal uppercase mb-0.5">Price (₹) *</label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={v.price}
                          onChange={(e) => handleVariantChange(idx, "price", e.target.value)}
                          placeholder="380"
                          className="input-heritage text-xs py-1.5 font-semibold"
                        />
                      </div>
                      
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-charcoal uppercase mb-0.5">Compare Price</label>
                        <input
                          type="number"
                          step="0.01"
                          value={v.comparePrice || ""}
                          onChange={(e) => handleVariantChange(idx, "comparePrice", e.target.value || null)}
                          placeholder="420"
                          className="input-heritage text-xs py-1.5"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-charcoal uppercase mb-0.5">Stock *</label>
                        <input
                          type="number"
                          required
                          value={v.stock}
                          onChange={(e) => handleVariantChange(idx, "stock", Number(e.target.value))}
                          placeholder="20"
                          className="input-heritage text-xs py-1.5"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-charcoal uppercase mb-0.5">Low Stock</label>
                        <input
                          type="number"
                          required
                          value={v.lowStockThreshold}
                          onChange={(e) => handleVariantChange(idx, "lowStockThreshold", Number(e.target.value))}
                          placeholder="3"
                          className="input-heritage text-xs py-1.5"
                        />
                      </div>

                      <div className="sm:col-span-1 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(idx)}
                          className="text-red-500 hover:text-red-600 transition-colors p-2.5 cursor-pointer"
                          aria-label="Remove variant"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Columns - Details / Category / Flags */}
        <div className="lg:col-span-4 space-y-6">
          {/* Category & Status */}
          <div className="bg-white rounded-sm p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-serif text-xs font-bold text-charcoal uppercase tracking-wider pb-2 border-b">
              Category & Status
            </h3>

            <div>
              <label className="block text-xs font-serif font-bold text-charcoal uppercase tracking-wider mb-1">
                Parent Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="input-heritage text-xs cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2.5 pt-2">
              <label className="flex items-center gap-2 text-xs font-medium text-charcoal cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="accent-brand-primary"
                />
                Show product in catalogue (Active)
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-charcoal cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="accent-brand-primary"
                />
                Featured item (Homepage Spotlight)
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-charcoal cursor-pointer">
                <input
                  type="checkbox"
                  checked={isBestseller}
                  onChange={(e) => setIsBestseller(e.target.checked)}
                  className="accent-brand-primary"
                />
                Mark as best seller
              </label>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="bg-white rounded-sm p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-serif text-xs font-bold text-charcoal uppercase tracking-wider pb-2 border-b">
              Technical Specifications
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-muted uppercase mb-1">Courier SKU</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="E.g., TEA-DARJ-FF"
                  className="input-heritage text-xs"
                />
              </div>

              {variants.length === 0 && (
                <div>
                  <label className="block text-[10px] font-bold text-muted uppercase mb-1">Standard Weight</label>
                  <input
                    type="text"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="E.g., 250g"
                    className="input-heritage text-xs"
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-muted uppercase mb-1">GST HSN Classification *</label>
                <input
                  type="text"
                  required
                  value={hsnCode}
                  onChange={(e) => setHsnCode(e.target.value)}
                  placeholder="E.g., 09024020"
                  className="input-heritage text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-muted uppercase mb-1">GST Tax Rate *</label>
                <select
                  value={gstPercent}
                  onChange={(e) => setGstPercent(e.target.value)}
                  className="input-heritage text-xs cursor-pointer font-mono"
                >
                  <option value="5">5% (Teas, Coffees, Sweets)</option>
                  <option value="12">12% (Jams, Preserves, Artisan Cheese)</option>
                  <option value="18">18% (Artisan souvenirs / infusers)</option>
                  <option value="0">0% (Tax exempt)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-muted uppercase mb-1">Geographical Origin</label>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="E.g., Kurseong Hills, Darjeeling"
                  className="input-heritage text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-muted uppercase mb-1">Shelf Life (Months)</label>
                <input
                  type="text"
                  value={shelfLife}
                  onChange={(e) => setShelfLife(e.target.value)}
                  placeholder="E.g., 12 Months"
                  className="input-heritage text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-muted uppercase mb-1">Ingredients List</label>
                <textarea
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  placeholder="E.g., 100% Premium Whole Leaf Darjeeling Black Tea."
                  rows={3}
                  className="input-heritage text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
