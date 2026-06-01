import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Package, Edit, Trash2, Check, X } from "lucide-react";

export const metadata: Metadata = { title: "Manage Catalogue" };
export const revalidate = 0;

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      variants: true,
    },
  });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal">Manage Catalogue</h1>
          <p className="text-sm text-muted mt-1">
            Create, edit, and control pricing, variants, and descriptions for all items.
          </p>
        </div>
        <Link href="/admin/products/new" className="btn-primary text-xs py-2.5 flex items-center gap-1">
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Catalogue Table */}
      <div className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden">
        {products.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto text-muted">
              <Package className="w-6 h-6" />
            </div>
            <p className="font-serif text-base font-semibold text-charcoal">No products in catalogue</p>
            <p className="text-xs text-muted">Click the Add Product button above to populate your catalog.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-3.5 text-xs font-semibold text-muted">Product</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-muted">Category</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-muted">Base Price</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-muted">Variants</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-muted">Total Stock</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-muted">Active</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-muted text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => {
                  const stockSum = product.variants.length > 0
                    ? product.variants.reduce((s, v) => s + v.stock, 0)
                    : product.stock;

                  return (
                    <tr key={product.id} className="hover:bg-gray-50/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-brand-light flex items-center justify-center text-lg rounded-sm">
                            🍃
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-charcoal leading-tight">{product.name}</div>
                            <div className="text-[10px] text-muted font-mono mt-0.5">SKU: {product.sku || "—"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-charcoal">
                        <span className="badge-heritage text-[10px] px-2 py-0.5">{product.category.name}</span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-charcoal">{formatPrice(Number(product.basePrice))}</td>
                      <td className="px-6 py-4">
                        {product.variants.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {product.variants.map((v) => (
                              <span key={v.id} className="text-[9px] px-1.5 py-0.5 border rounded-sm font-semibold bg-gray-50 text-gray-600">
                                {v.label} (₹{Number(v.price)})
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-muted">Single variant</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-bold ${
                          stockSum <= product.lowStockThreshold ? "text-orange-600 animate-pulse" : "text-charcoal"
                        }`}>
                          {stockSum} units
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {product.isActive ? (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-green-600 uppercase bg-green-50 px-2 py-0.5 rounded-full border border-green-200/50">
                            <Check className="w-3 h-3" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-red-500 uppercase bg-red-50 px-2 py-0.5 rounded-full border border-red-200/50">
                            <X className="w-3 h-3" /> Hidden
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="btn-secondary py-1 px-3 text-xs inline-flex items-center gap-1 cursor-pointer font-medium hover:bg-brand-primary hover:text-white"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          Edit
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
