"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminFooter from "@/components/admin/AdminFooter";
import { uploadToCloudinary } from "@/lib/cloudinary";

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

/* ── Image icon ── */
function ImageIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <path
        d="M8 48L20 32L29 43L38 34L56 48H8Z"
        stroke="#003F62"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="22" r="5" stroke="#003F62" strokeWidth="2.5" />
      <rect x="6" y="8" width="52" height="48" rx="4" stroke="#003F62" strokeWidth="2.5" />
    </svg>
  );
}

/* ── Checkmark icon ── */
function CheckIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="14" fill="#003F62" />
      <path d="M10 16L14 20L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface ProductForm {
  name: string;
  description: string;
  category: string;
  brand: string;
  sku: string;
  stock: string;
  price: string;
  salePrice: string;
  tags: string[];
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [form, setForm] = useState<ProductForm>({
    name: "",
    description: "",
    category: "",
    brand: "",
    sku: "",
    stock: "",
    price: "",
    salePrice: "",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── Fetch product ── */
  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/products/${id}`);
        if (!res.ok) throw new Error("Not found");
        const p = await res.json();
        setForm({
          name: p.name ?? "",
          description: p.description ?? "",
          category: p.category ?? "",
          brand: p.brand ?? "",
          sku: p.sku ?? "",
          stock: String(p.stock ?? ""),
          price: String(p.price ?? ""),
          salePrice: String(p.salePrice ?? ""),
          tags: Array.isArray(p.tags) ? p.tags : [],
        });
        setImages(Array.isArray(p.images) ? p.images : []);
      } catch {
        // leave form empty, show error via loading fallback
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  /* ── Update ── */
  const handleUpdate = async () => {
    setSaving(true);
    setSaveError("");
    setSaveSuccess(false);
    try {
      const token = localStorage.getItem("shopco_token");
      const res = await fetch(`http://localhost:3001/api/products/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          category: form.category,
          brand: form.brand,
          sku: form.sku,
          stock: Number(form.stock),
          price: Number(form.price),
          salePrice: form.salePrice ? Number(form.salePrice) : null,
          tags: form.tags,
          images,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      setSaveError("Failed to update. Check your login.");
    } finally {
      setSaving(false);
    }
  };

  /* ── Delete ── */
  const handleDelete = async () => {
    const token = localStorage.getItem("shopco_token");
    await fetch(`http://localhost:3001/api/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    router.push("/admin/products");
  };

  /* ── Tag input ── */
  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      setForm((f) => ({ ...f, tags: [...f.tags, tagInput.trim()] }));
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    setForm((f) => ({ ...f, tags: f.tags.filter((_, i) => i !== index) }));
  };

  /* ── Image upload via Cloudinary ── */
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    setSaveError("");
    try {
      const urls = await Promise.all(files.map((f) => uploadToCloudinary(f)));
      setImages((prev) => [...prev, ...urls]);
    } catch {
      setSaveError("Image upload failed. Check your Cloudinary config.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const fieldClass =
    "w-full h-[48px] border border-[#232321] rounded-lg px-4 text-[16px] text-black focus:outline-none focus:border-[#003F62] bg-white";
  const labelClass = "text-[20px] font-semibold text-[#232321]";

  if (loading) {
    return (
      <div className="flex items-center justify-center pt-20">
        <p className="text-sm text-black/50" style={{ fontFamily: "'Open Sans'" }}>
          Loading product…
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pt-6 pb-10">
      {showDelete && (
        <ConfirmDeleteModal onConfirm={handleDelete} onCancel={() => setShowDelete(false)} />
      )}

      {/* ── Breadcrumb ── */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[24px] font-semibold leading-7 text-black" style={{ fontFamily: "'Rubik'" }}>
          Product Details
        </h1>
        <p className="text-[16px] font-semibold opacity-80" style={{ fontFamily: "'Open Sans'", color: "#000" }}>
          Home &gt; All Products &gt; Product Details
        </p>
      </div>

      {/* ── White card ── */}
      <div className="bg-white rounded-2xl p-6 flex flex-col gap-10">
        <div className="flex flex-row gap-12 items-start">

          {/* ── LEFT: form ── */}
          <div className="flex flex-col text-black gap-6 flex-1 min-w-0">

            {/* Product Name */}
            <div className="flex flex-col gap-4">
              <label className={labelClass} style={{ fontFamily: "'Rubik'" }}>Product Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className={fieldClass}
                style={{ fontFamily: "'Inter'" }}
                placeholder="Lorem Ipsum"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-4">
              <label className={labelClass} style={{ fontFamily: "'Rubik'" }}>Description</label>
              <textarea
                rows={6}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full border border-[#232321] rounded-lg px-4 py-3 text-[16px] text-black focus:outline-none focus:border-[#003F62] resize-none bg-white"
                style={{ fontFamily: "'Inter'" }}
                placeholder="Lorem Ipsum Is A Dummy Text"
              />
            </div>

            {/* Category */}
            <div className="flex flex-col gap-4">
              <label className={labelClass} style={{ fontFamily: "'Rubik'" }}>Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className={fieldClass}
                style={{ fontFamily: "'Inter'" }}
              >
                <option value="">Select a category</option>
                <option value="Casual">Casual</option>
                <option value="Formal">Formal</option>
                <option value="Party">Party</option>
                <option value="Gym">Gym</option>
                <option value="T-shirts">T-shirts</option>
                <option value="Shorts">Shorts</option>
                <option value="Shirts">Shirts</option>
                <option value="Hoodie">Hoodie</option>
                <option value="Jeans">Jeans</option>
              </select>
            </div>

            {/* Brand Name */}
            <div className="flex flex-col gap-4">
              <label className={labelClass} style={{ fontFamily: "'Rubik'" }}>Brand Name</label>
              <input
                type="text"
                value={form.brand}
                onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
                className={fieldClass}
                style={{ fontFamily: "'Inter'" }}
                placeholder="Adidas"
              />
            </div>

            {/* SKU + Stock Quantity */}
            <div className="flex gap-6">
              <div className="flex flex-col gap-4 flex-1">
                <label className={labelClass} style={{ fontFamily: "'Rubik'" }}>SKU</label>
                <input
                  type="text"
                  value={form.sku}
                  onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
                  className={fieldClass}
                  style={{ fontFamily: "'Inter'" }}
                  placeholder="#32A53"
                />
              </div>
              <div className="flex flex-col gap-4 flex-1">
                <label className={labelClass} style={{ fontFamily: "'Rubik'" }}>Stock Quantity</label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                  className={fieldClass}
                  style={{ fontFamily: "'Inter'" }}
                  placeholder="211"
                />
              </div>
            </div>

            {/* Regular Price + Sale Price */}
            <div className="flex gap-6">
              <div className="flex flex-col gap-4 flex-1">
                <label className={labelClass} style={{ fontFamily: "'Rubik'" }}>Regular Price</label>
                <div className="relative">
                  <span
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[16px]"
                    style={{ fontFamily: "'Inter'", color: "#1F1A24" }}
                  >
                    $
                  </span>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    className="w-full h-[48px] border border-[#232321] rounded-lg pl-8 pr-4 text-[16px] focus:outline-none focus:border-[#003F62] bg-white"
                    style={{ fontFamily: "'Inter'" }}
                    placeholder="110.40"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4 flex-1">
                <label className={labelClass} style={{ fontFamily: "'Rubik'" }}>Sale Price</label>
                <div className="relative">
                  <span
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[16px]"
                    style={{ fontFamily: "'Inter'", color: "#79767C" }}
                  >
                    $
                  </span>
                  <input
                    type="number"
                    value={form.salePrice}
                    onChange={(e) => setForm((f) => ({ ...f, salePrice: e.target.value }))}
                    className="w-full h-[48px] border border-[#232321] rounded-lg pl-8 pr-4 text-[16px] focus:outline-none focus:border-[#003F62] bg-white"
                    style={{ fontFamily: "'Inter'" }}
                    placeholder="450"
                  />
                </div>
              </div>
            </div>

            {/* Tag */}
            <div className="flex flex-col gap-4">
              <label className={labelClass} style={{ fontFamily: "'Rubik'" }}>Tag</label>
              <div
                className="w-full min-h-[99px] border border-[#232321] rounded-lg p-4 flex flex-row flex-wrap gap-3 items-start"
                style={{ fontFamily: "'Inter'" }}
                onClick={() => document.getElementById("tag-input")?.focus()}
              >
                {form.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1 px-3 py-1 rounded-full text-[14px] text-[#E9E9EA] cursor-pointer"
                    style={{ background: "#36323B", fontFamily: "'Inter'" }}
                    onClick={() => removeTag(i)}
                  >
                    {tag}
                    <span className="text-[#E9E9EA] opacity-60 ml-1">×</span>
                  </span>
                ))}
                <input
                  id="tag-input"
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={addTag}
                  className="flex-1 min-w-[100px] outline-none text-[16px] text-black bg-transparent"
                  placeholder={form.tags.length === 0 ? "Type a tag and press Enter" : ""}
                  style={{ fontFamily: "'Inter'" }}
                />
              </div>
              <p className="text-[12px] opacity-50" style={{ fontFamily: "'Open Sans'" }}>
                Press Enter or comma to add a tag. Click a tag to remove it.
              </p>
            </div>
          </div>

          {/* ── RIGHT: image panel ── */}
          <div className="flex flex-col gap-6 w-[457px] shrink-0">

            {/* Main image display */}
            <div
              className="w-full rounded-2xl overflow-hidden flex items-center justify-center"
              style={{ height: 444, background: "#FAFAFA" }}
            >
              {images[0] ? (
                <img
                  src={images[0]}
                  alt="Main product"
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <div
                  className="w-full h-full rounded-xl"
                  style={{ background: "rgba(0,0,0,0.2)" }}
                />
              )}
            </div>

            {/* Product Gallery upload */}
            <div className="flex flex-col gap-4">
              <h3
                className="text-[20px] font-semibold"
                style={{ fontFamily: "'Rubik'", color: "#232321" }}
              >
                Product Gallery
              </h3>

              {/* Drop zone */}
              <div
                className="w-full flex flex-col items-center justify-center gap-4 py-6 rounded-lg cursor-pointer hover:bg-black/5 transition-colors"
                style={{ border: "1px dashed #232321" }}
                onClick={() => !uploading && fileInputRef.current?.click()}
              >
                <ImageIcon />
                <div className="flex flex-col items-center gap-2">
                  <span
                    className="text-[16px] font-semibold text-center"
                    style={{ fontFamily: "'Open Sans'", color: "#70706E" }}
                  >
                    {uploading ? "Uploading…" : "Drop your image here, or browse"}
                  </span>
                  {!uploading && (
                    <span
                      className="text-[16px] font-semibold text-center"
                      style={{ fontFamily: "'Open Sans'", color: "#70706E" }}
                    >
                      Jpeg, png are allowed
                    </span>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>

              {/* Thumbnail list */}
              <div className="flex flex-col gap-3">
                {(images.length > 0 ? images : ["", "", "", ""]).map((img, i) => (
                  <div
                    key={i}
                    className="flex flex-row items-center gap-4 p-4 rounded-lg"
                    style={{ background: "#FAFAFA" }}
                  >
                    {/* Thumb */}
                    <div
                      className="w-[64px] h-[64px] rounded-lg shrink-0 overflow-hidden"
                      style={{ background: "rgba(0,0,0,0.2)" }}
                    >
                      {img && (
                        <img src={img} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                      )}
                    </div>

                    {/* Name + progress */}
                    <div className="flex flex-col gap-2 flex-1 min-w-0 pt-2">
                      <span
                        className="text-[16px] font-semibold truncate"
                        style={{ fontFamily: "'Open Sans'", color: "#232321" }}
                      >
                        {img ? `Product image ${i + 1}` : "Product thumbnail.png"}
                      </span>
                      <div className="relative w-full h-[4px]">
                        <div className="absolute inset-0 rounded-full" style={{ background: "#4A69E2" }} />
                        <div
                          className="absolute left-0 top-0 h-full rounded-full"
                          style={{ width: img ? "100%" : "47%", background: "#003F62" }}
                        />
                      </div>
                    </div>

                    {/* Check */}
                    <div className="shrink-0">
                      <CheckIcon />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-row gap-4 justify-end">
              <button
                onClick={handleUpdate}
                disabled={saving}
                className="flex-1 h-[48px] rounded-lg text-[14px] font-medium uppercase tracking-[0.25px] text-white disabled:opacity-60"
                style={{ background: "#232321", fontFamily: "'Rubik'" }}
              >
                {saving ? "Saving…" : "UPDATE"}
              </button>
              <button
                onClick={() => setShowDelete(true)}
                className="flex-1 h-[48px] rounded-lg text-[14px] font-medium uppercase tracking-[0.25px] text-white"
                style={{ background: "#003F62", fontFamily: "'Rubik'" }}
              >
                DELETE
              </button>
              <button
                onClick={() => router.push("/admin/products")}
                className="flex-1 h-[48px] rounded-lg border text-[14px] font-medium uppercase tracking-[0.25px]"
                style={{ borderColor: "#232321", color: "#232321", fontFamily: "'Rubik'" }}
              >
                CANCEL
              </button>
            </div>

            {saveError && (
              <p className="text-red-500 text-[13px]" style={{ fontFamily: "'Open Sans'" }}>
                {saveError}
              </p>
            )}
            {saveSuccess && (
              <p className="text-green-600 text-[13px]" style={{ fontFamily: "'Open Sans'" }}>
                Product updated successfully!
              </p>
            )}
          </div>
        </div>
      </div>

      <AdminFooter />
    </div>
  );
}
