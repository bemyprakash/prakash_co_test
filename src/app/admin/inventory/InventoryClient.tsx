"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Warehouse, AlertTriangle, RefreshCw, CheckCircle, Package } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Variant {
  id: string;
  label: string;
  price: string;
  stock: number;
  lowStockThreshold: number;
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
  sku: string | null;
  weight: string | null;
  stock: number;
  lowStockThreshold: number;
  category: Category;
  variants: Variant[];
}

interface Props {
  initialProducts: Product[];
}

export function InventoryClient({ initialProducts }: Props) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Handle local stock input change for products (single item)
  const handleProductStockChange = (productId: string, value: number) => {
    setProducts(
      products.map(p => (p.id === productId ? { ...p, stock: value } : p))
    );
  };

  // Handle local stock input change for variants
  const handleVariantStockChange = (productId: string, variantId: string, value: number) => {
    setProducts(
      products.map(p => {
        if (p.id === productId) {
          return {
            ...p,
            variants: p.variants.map(v => (v.id === variantId ? { ...v, stock: value } : v)),
          };
        }
        return p;
      })
    );
  };

  // Persist stock change to DB
  const handleSaveStock = async (type: "product" | "variant", id: string, stock: number) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin/inventory/update-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id, stock }),
      });

      if (!res.ok) throw new Error();

      toast.success("Stock level updated successfully!");
      router.refresh();
    } catch {
      toast.error("Failed to update stock level.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/admin"
          className="flex items-center gap-1.5 text-xs text-muted hover:text-brand-primary transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white rounded-sm p-6 border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-sm flex items-center justify-center bg-brand-light">
          <Warehouse className="w-6 h-6 text-brand-primary" />
        </div>
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal">Manage Inventory</h1>
          <p className="text-sm text-muted mt-0.5">
            Quickly monitor stock counts, track thresholds, and adjust physical inventories inline.
          </p>
        </div>
      </div>

      {/* Inventory List */}
      <div className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-gray-100 bg-gray-50/50">
              <th className="px-6 py-3.5 text-xs font-semibold text-muted">Item / Description</th>
              <th className="px-6 py-3.5 text-xs font-semibold text-muted">SKU</th>
              <th className="px-6 py-3.5 text-xs font-semibold text-muted text-center">Status</th>
              <th className="px-6 py-3.5 text-xs font-semibold text-muted text-center w-40">Current Stock</th>
              <th className="px-6 py-3.5 text-xs font-semibold text-muted text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => {
              const hasVariants = product.variants.length > 0;

              if (!hasVariants) {
                const isLow = product.stock <= product.lowStockThreshold;
                return (
                  <tr key={product.id} className="hover:bg-gray-50/10 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-serif font-bold text-charcoal text-xs">{product.name}</p>
                      <p className="text-[10px] text-muted font-medium mt-0.5">{product.category.name}</p>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-muted">{product.sku || "—"}</td>
                    <td className="px-6 py-4 text-center">
                      {isLow ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-orange-600 uppercase bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200/50 animate-pulse">
                          <AlertTriangle className="w-3 h-3" /> Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-green-600 uppercase bg-green-50 px-2 py-0.5 rounded-full border border-green-200/50">
                          <CheckCircle className="w-3 h-3" /> Healthy
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <input
                        type="number"
                        value={product.stock}
                        onChange={(e) => handleProductStockChange(product.id, Number(e.target.value))}
                        className="w-24 text-center py-1 border rounded-sm font-semibold text-xs focus:ring-1 focus:ring-brand-primary outline-none"
                      />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleSaveStock("product", product.id, product.stock)}
                        disabled={updatingId === product.id}
                        className="btn-primary py-1 px-3 text-xs inline-flex items-center gap-1 cursor-pointer font-medium hover:bg-brand-deep"
                      >
                        {updatingId === product.id ? (
                          <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : (
                          "Save"
                        )}
                      </button>
                    </td>
                  </tr>
                );
              }

              // Renders nested rows for items with variants
              return (
                <tr key={product.id} className="bg-gray-50/20">
                  <td colSpan={5} className="p-0 border-b border-gray-100">
                    <div className="px-6 py-3 bg-gray-50/40 border-b font-serif font-bold text-charcoal text-xs">
                      📁 {product.name} <span className="text-[10px] text-muted font-sans font-medium">({product.category.name} — Multi-variant)</span>
                    </div>
                    <table className="w-full text-xs text-left border-collapse">
                      <tbody>
                        {product.variants.map((v) => {
                          const isLow = v.stock <= v.lowStockThreshold;
                          return (
                            <tr key={v.id} className="hover:bg-gray-50/40 border-b border-gray-100/50">
                              <td className="px-12 py-3 text-muted font-medium w-[35%]">↳ {v.label}</td>
                              <td className="px-6 py-3 font-mono text-[11px] text-muted w-[18%]">{v.sku || "—"}</td>
                              <td className="px-6 py-3 text-center w-[15%]">
                                {isLow ? (
                                  <span className="inline-flex items-center gap-1 text-[9px] font-bold text-orange-600 uppercase bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200/50 animate-pulse">
                                    <AlertTriangle className="w-3 h-3" /> Low Stock
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-green-600 uppercase bg-green-50 px-2 py-0.5 rounded-full border border-green-200/50">
                                    <CheckCircle className="w-3 h-3" /> Healthy
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-3 text-center w-[18%]">
                                <input
                                  type="number"
                                  value={v.stock}
                                  onChange={(e) => handleVariantStockChange(product.id, v.id, Number(e.target.value))}
                                  className="w-24 text-center py-1 border rounded-sm font-semibold text-xs focus:ring-1 focus:ring-brand-primary outline-none bg-white"
                                />
                              </td>
                              <td className="px-6 py-3 text-right">
                                <button
                                  onClick={() => handleSaveStock("variant", v.id, v.stock)}
                                  disabled={updatingId === v.id}
                                  className="btn-primary py-1 px-3 text-[10px] inline-flex items-center gap-1 cursor-pointer font-medium hover:bg-brand-deep"
                                >
                                  {updatingId === v.id ? (
                                    <RefreshCw className="w-3 h-3 animate-spin" />
                                  ) : (
                                    "Save"
                                  )}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
