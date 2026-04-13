"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import AdminFooter from "@/components/admin/AdminFooter";
import { uploadToCloudinary } from "@/lib/cloudinary";

/* ── Image icon ── */
function ImageIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <path d="M8 48L20 32L29 43L38 34L56 48H8Z" stroke="#003F62" strokeWidth="2.5" strokeLinejoin="round" />
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

export default function AddProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /* ── Submit ── */
  const handleCreate = async () => {
    if (!form.name || !form.price || !form.stock) {
      setError("Name, price and stock are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const token = localStorage.getItem("shopco_token");
      const res = await fetch("http://localhost:3001/api/products", {
        method: "POST",
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
      router.push("/admin/products");
    } catch {
      setError("Failed to create product. Check your login.");
    } finally {
      setSaving(false);
    }
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
    setError("");
    try {
      const urls = await Promise.all(files.map((f) => uploadToCloudinary(f)));
      setImages((prev) => [...prev, ...urls]);
    } catch {
      setError("Image upload failed. Check your Cloudinary config.");
    } finally {
      setUploading(false);
      // reset input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const fieldClass =
    "w-full h-12 border border-[#232321] rounded-lg px-4 text-[16px] text-black focus:outline-none focus:border-[#003F62] bg-white";
  const labelClass = "text-[20px] font-semibold text-[#232321]";

  return (
    <div className="flex flex-col gap-6 pt-6 pb-10">

      {/* ── Breadcrumb ── */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[24px] font-semibold leading-7 text-black" style={{ fontFamily: "'Rubik'" }}>
          Add New Product
        </h1>
        <p className="text-[16px] font-semibold opacity-80" style={{ fontFamily: "'Open Sans'", color: "#000" }}>
          Home &gt; All Products &gt; Add New Product
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
                    className="w-full h-12 border border-[#232321] rounded-lg pl-8 pr-4 text-[16px] focus:outline-none focus:border-[#003F62] bg-white"
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
                    className="w-full h-12 border border-[#232321] rounded-lg pl-8 pr-4 text-[16px] focus:outline-none focus:border-[#003F62] bg-white"
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
                className="w-full min-h-24 border border-[#232321] rounded-lg p-4 flex flex-row flex-wrap gap-3 items-start cursor-text"
                onClick={() => document.getElementById("tag-input-new")?.focus()}
              >
                {form.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1 px-3 py-1 rounded-full text-[14px] text-[#E9E9EA] cursor-pointer"
                    style={{ background: "#36323B", fontFamily: "'Inter'" }}
                    onClick={() => removeTag(i)}
                  >
                    {tag}
                    <span className="opacity-60 ml-1">×</span>
                  </span>
                ))}
                <input
                  id="tag-input-new"
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={addTag}
                  className="flex-1 min-w-25 outline-none text-[16px] text-black bg-transparent"
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

            {/* Main image preview */}
            <div
              className="w-full rounded-2xl overflow-hidden flex items-center justify-center"
              style={{ height: 444, background: "#FAFAFA" }}
            >
              {images[0] ? (
                <img src={images[0]} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <div className="w-full h-full rounded-xl" style={{ background: "rgba(0,0,0,0.2)" }} />
              )}
            </div>

            {/* Product Gallery */}
            <div className="flex flex-col gap-4">
              <h3 className="text-[20px] font-semibold" style={{ fontFamily: "'Rubik'", color: "#232321" }}>
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
                  <span className="text-[16px] font-semibold text-center" style={{ fontFamily: "'Open Sans'", color: "#70706E" }}>
                    {uploading ? "Uploading…" : "Drop your image here, or browse"}
                  </span>
                  {!uploading && (
                    <span className="text-[16px] font-semibold text-center" style={{ fontFamily: "'Open Sans'", color: "#70706E" }}>
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
                  <div key={i} className="flex flex-row items-center gap-4 p-4 rounded-lg" style={{ background: "#FAFAFA" }}>
                    <div
                      className="w-16 h-16 rounded-lg shrink-0 overflow-hidden"
                      style={{ background: "rgba(0,0,0,0.2)" }}
                    >
                      {img && <img src={img} alt={`thumb-${i}`} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex flex-col gap-2 flex-1 min-w-0 pt-2">
                      <span className="text-[16px] font-semibold truncate" style={{ fontFamily: "'Open Sans'", color: "#232321" }}>
                        {img ? `Product image ${i + 1}` : "Product thumbnail.png"}
                      </span>
                      <div className="relative w-full h-1">
                        <div className="absolute inset-0 rounded-full" style={{ background: "#4A69E2" }} />
                        <div
                          className="absolute left-0 top-0 h-full rounded-full"
                          style={{ width: img ? "100%" : "47%", background: "#003F62" }}
                        />
                      </div>
                    </div>
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
                onClick={handleCreate}
                disabled={saving}
                className="flex-1 h-12 rounded-lg text-[14px] font-medium uppercase tracking-[0.25px] text-white disabled:opacity-60"
                style={{ background: "#232321", fontFamily: "'Rubik'" }}
              >
                {saving ? "Saving…" : "CREATE"}
              </button>
              <button
                onClick={() => router.push("/admin/products")}
                className="flex-1 h-12 rounded-lg border text-[14px] font-medium uppercase tracking-[0.25px]"
                style={{ borderColor: "#232321", color: "#232321", fontFamily: "'Rubik'" }}
              >
                CANCEL
              </button>
            </div>

            {error && (
              <p className="text-red-500 text-[13px]" style={{ fontFamily: "'Open Sans'" }}>
                {error}
              </p>
            )}
          </div>
        </div>
      </div>

      <AdminFooter />
    </div>
  );
}
