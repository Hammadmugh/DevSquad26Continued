"use client";

import Link from "next/link";

export interface AdminProduct {
  _id: string;
  name: string;
  category?: string;
  price: number;
  description: string;
  images: string[];
  stock: number;
  reviewCount: number;
  onSale?: boolean;
  salePrice?: number | null;
}

function ThreeDotsIcon() {
  return (
    <svg width="4" height="16" viewBox="0 0 4 16" fill="none">
      <circle cx="2" cy="2"  r="1.5" fill="#232321" fillOpacity="0.5" />
      <circle cx="2" cy="8"  r="1.5" fill="#232321" fillOpacity="0.5" />
      <circle cx="2" cy="14" r="1.5" fill="#232321" fillOpacity="0.5" />
    </svg>
  );
}

function ArrowUpYellow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 12V4M4 7L8 4L12 7"
        stroke="#FFA52F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AdminProductCard({ product, onEdit, onDelete }: {
  product: AdminProduct;
  onEdit?: (p: AdminProduct) => void;
  onDelete?: (id: string) => void;
}) {
  const total = (product.reviewCount ?? 0) + (product.stock ?? 0);
  const salesRatio = total > 0 ? (product.reviewCount ?? 0) / total : 0;
  const barFill = Math.round(salesRatio * 52); // 52px is full bar width

  const truncated =
    product.description.length > 80
      ? product.description.slice(0, 80) + "…"
      : product.description;

  return (
    <Link
      href={`/admin/products/${product._id}`}
      className="flex flex-col gap-4 p-4 rounded-2xl w-full cursor-pointer hover:shadow-md transition-shadow no-underline"
      style={{ background: "#FAFAFA", textDecoration: "none" }}
    >
      {/* ── Top: image + info ── */}
      <div className="flex items-start gap-4">
        {/* Image */}
        <div
          className="w-[84px] h-[84px] rounded-lg shrink-0 overflow-hidden"
          style={{ background: "rgba(0,0,0,0.18)" }}
        >
          {product.images?.[0] && (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {/* Name + dots */}
          <div className="flex items-start gap-2">
            <div className="flex-1 flex flex-col gap-0.5 min-w-0">
              <span
                className="text-[16px] font-semibold truncate"
                style={{ fontFamily: "'Open Sans'", color: "#232321" }}
              >
                {product.name}
              </span>
              <span
                className="text-[14px] font-semibold"
                style={{ fontFamily: "'Open Sans'", color: "rgba(0,0,0,0.6)" }}
              >
                {product.category || "—"}
              </span>
            </div>
            <button
              className="flex items-center justify-center p-2 rounded shrink-0 hover:opacity-70 transition-opacity"
              style={{ background: "rgba(35,35,33,0.05)" }}
              onClick={(e) => { e.preventDefault(); onEdit?.(product); }}
              aria-label="Options"
            >
              <ThreeDotsIcon />
            </button>
          </div>

          {/* Price */}
          <span
            className="text-[14px] font-semibold"
            style={{ fontFamily: "'Rubik'", color: "#232321" }}
          >
            ${product.price.toLocaleString("en-US")}
          </span>
        </div>
      </div>

      {/* ── Summary ── */}
      <div className="flex flex-col gap-1">
        <span
          className="text-[16px] font-semibold"
          style={{ fontFamily: "'Open Sans'", color: "#232321" }}
        >
          Summary
        </span>
        <p
          className="text-[14px] leading-[19px]"
          style={{ fontFamily: "'Open Sans'", color: "#232321", opacity: 0.6 }}
        >
          {truncated || "No description."}
        </p>
      </div>

      {/* ── Stats box ── */}
      <div
        className="flex flex-col gap-2 p-4 rounded-lg"
        style={{ border: "0.75px solid rgba(35,35,33,0.3)" }}
      >
        {/* Sales row */}
        <div className="flex items-center justify-between">
          <span
            className="text-[14px] font-semibold"
            style={{ fontFamily: "'Open Sans'", color: "#232321", opacity: 0.8 }}
          >
            Sales
          </span>
          <div className="flex items-center gap-2">
            <ArrowUpYellow />
            <span
              className="text-[14px] font-semibold"
              style={{ fontFamily: "'Open Sans'", color: "rgba(0,0,0,0.6)" }}
            >
              {product.reviewCount ?? 0}
            </span>
          </div>
        </div>

        <hr style={{ borderColor: "#232321", opacity: 0.4 }} />

        {/* Remaining row */}
        <div className="flex items-center justify-between">
          <span
            className="text-[14px] font-semibold"
            style={{ fontFamily: "'Open Sans'", color: "#232321", opacity: 0.8 }}
          >
            Remaining Products
          </span>
          <div className="flex items-center gap-2">
            {/* Progress bar */}
            <div className="relative w-[52px] h-[4px]">
              <div
                className="absolute inset-0 rounded-full"
                style={{ background: "#E7E7E3" }}
              />
              <div
                className="absolute left-0 top-0 h-full rounded-full"
                style={{ width: `${barFill}px`, background: "#FFA52F" }}
              />
            </div>
            <span
              className="text-[14px] font-semibold"
              style={{ fontFamily: "'Open Sans'", color: "rgba(0,0,0,0.6)" }}
            >
              {product.stock ?? 0}
            </span>
          </div>
        </div>
      </div>

      {/* ── Delete button ── */}
      {onDelete && (
        <button
          onClick={(e) => { e.preventDefault(); onDelete(product._id); }}
          className="self-end text-[12px] font-medium text-red-500 hover:text-red-700 transition-colors"
          style={{ fontFamily: "'Open Sans'" }}
        >
          Delete
        </button>
      )}
    </Link>
  );
}
