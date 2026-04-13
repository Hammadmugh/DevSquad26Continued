"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminProductCard, { AdminProduct } from "@/components/admin/AdminProductCard";
import AdminFooter from "@/components/admin/AdminFooter";

const ITEMS_PER_PAGE = 9;

function AddCircleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.25" stroke="white" strokeWidth="1.5" />
      <path d="M8 5V11M5 8H11" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ChevronForward() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6 4L10 8L6 12" stroke="#232321" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Confirm Delete Modal ── */
function ConfirmDeleteModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onCancel}>
      <div
        className="bg-white rounded-2xl p-8 w-[400px] flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[20px] font-semibold" style={{ fontFamily: "'Rubik'", color: "#232321" }}>
          Delete Product
        </h2>
        <p className="text-[14px]" style={{ fontFamily: "'Open Sans'", color: "rgba(0,0,0,0.7)" }}>
          Are you sure you want to delete this product? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 rounded-lg border text-[13px] font-medium"
            style={{ borderColor: "#232321", color: "#232321", fontFamily: "'Rubik'" }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2 rounded-lg text-[13px] font-medium text-white"
            style={{ background: "#DC2626", fontFamily: "'Rubik'" }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function AdminProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get("category") ?? "";

  const [allProducts, setAllProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"}/api/products`);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setAllProducts(Array.isArray(data) ? data : []);
    } catch {
      setError("Could not load products. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Reset to page 1 when category filter changes
  useEffect(() => { setPage(1); }, [categoryFilter]);

  const products = categoryFilter
    ? allProducts.filter((p) => p.category?.toLowerCase() === categoryFilter.toLowerCase())
    : allProducts;

  const totalPages = Math.max(1, Math.ceil(products.length / ITEMS_PER_PAGE));
  const paged = products.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const token = localStorage.getItem("shopco_token");
    await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"}/api/products/${deleteId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setDeleteId(null);
    fetchProducts();
  };

  return (
    <div className="flex flex-col gap-6 pt-6 pb-10">
      {deleteId && (
        <ConfirmDeleteModal onConfirm={confirmDelete} onCancel={() => setDeleteId(null)} />
      )}

      {/* ── Page header ── */}
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <h1
            className="text-[24px] font-semibold leading-7"
            style={{ fontFamily: "'Rubik'", color: "#232321" }}
          >
            {categoryFilter ? `${categoryFilter} Products` : "All Products"}
          </h1>
          <p
            className="text-[16px] font-semibold"
            style={{ fontFamily: "'Open Sans'", color: "rgba(0,0,0,0.8)" }}
          >
            Home &gt; {categoryFilter ? <><span className="cursor-pointer hover:underline" onClick={() => router.push("/admin/products")}>All Products</span> &gt; {categoryFilter}</> : "All Products"}
          </p>
        </div>

        <button
          onClick={() => router.push("/admin/products/new")}
          className="flex items-center gap-2 px-4 py-3 rounded-lg text-[14px] font-medium uppercase tracking-[0.25px] text-white"
          style={{ background: "#232321", fontFamily: "'Rubik'" }}
        >
          <AddCircleIcon />
          ADD NEW PRODUCT
        </button>
      </div>

      {/* ── Product grid ── */}
      {loading && (
        <p className="text-sm text-black/50" style={{ fontFamily: "'Open Sans'" }}>
          Loading products…
        </p>
      )}
      {error && (
        <p className="text-sm text-red-500" style={{ fontFamily: "'Open Sans'" }}>
          {error}
        </p>
      )}

      {!loading && !error && products.length === 0 && (
        <p className="text-sm text-black/50" style={{ fontFamily: "'Open Sans'" }}>
          {categoryFilter ? `No products found in "${categoryFilter}" category.` : "No products found. Add your first product!"}
        </p>
      )}

      {!loading && !error && paged.length > 0 && (
        <div className="grid grid-cols-3 gap-3.5">
          {paged.map((product) => (
            <AdminProductCard
              key={product._id}
              product={product}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className="w-[39px] h-[32px] rounded-lg text-[14px] font-medium uppercase tracking-[0.25px] transition-colors"
              style={{
                fontFamily: "'Inter'",
                background: p === page ? "#232321" : "transparent",
                color: p === page ? "#FFFFFF" : "#232321",
                border: p === page ? "none" : "1px solid #232321",
              }}
            >
              {p}
            </button>
          ))}
          {page < totalPages && (
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              className="flex items-center gap-1 px-4 h-[32px] rounded-lg border text-[14px] font-medium uppercase tracking-[0.25px] hover:bg-black/5 transition-colors"
              style={{ borderColor: "#232321", color: "#232321", fontFamily: "'Inter'" }}
            >
              Next
              <ChevronForward />
            </button>
          )}
        </div>
      )}

      {/* ── Footer ── */}
      <AdminFooter />
    </div>
  );
}
