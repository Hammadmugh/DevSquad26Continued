"use client";

import { useState, use, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ReviewCard from "@/components/ReviewCard";
import WriteReviewModal from "@/components/WriteReviewModal";
import { getProductById, productReviews, products, youMightAlsoLike } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/products";

type BackendProduct = {
  _id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number | null;
  onSale?: boolean;
  rating: number;
  reviewCount?: number;
  images: string[];
  category?: string;
  stock?: number;
};

function backendToProduct(p: BackendProduct): Product {
  const displayPrice = p.onSale && p.salePrice ? p.salePrice : p.price;
  const originalPrice = p.onSale && p.salePrice ? p.price : undefined;
  const discount = originalPrice ? Math.round((1 - displayPrice / originalPrice) * 100) : undefined;
  return {
    id: 0, // not used for backend products
    name: p.name,
    price: displayPrice,
    originalPrice,
    discount,
    rating: p.rating ?? 4,
    reviewCount: p.reviewCount ?? 0,
    description: p.description ?? "",
    images: p.images?.length ? p.images : ["/new-arrival-1.png"],
    colors: ["#4F4631", "#314F4A", "#31344F"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    category: p.category ?? "Casual",
  };
}

// --- Star Rating ---
function StarRating({ rating, size = 20 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i + 1 <= Math.floor(rating);
        const partial = !filled && i < rating;
        const fillPercent = partial ? Math.round((rating - Math.floor(rating)) * 100) : 0;
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path d="M9 1L11.09 6.26L17 7.27L13 11.14L14.18 17L9 14.27L3.82 17L5 11.14L1 7.27L6.91 6.26L9 1Z" fill="#e5e7eb" />
            </svg>
            <span className="absolute inset-0 overflow-hidden" style={{ width: filled ? "100%" : partial ? `${fillPercent}%` : "0%" }}>
              <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: size, height: size }}>
                <path d="M9 1L11.09 6.26L17 7.27L13 11.14L14.18 17L9 14.27L3.82 17L5 11.14L1 7.27L6.91 6.26L9 1Z" fill="#FFC633" />
              </svg>
            </span>
          </span>
        );
      })}
    </div>
  );
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  // Check if id looks like a MongoDB ObjectId (24-char hex)
  const isObjectId = /^[a-f\d]{24}$/i.test(id);
  const staticProduct = isObjectId ? null : getProductById(Number(id));

  const [product, setProduct] = useState<Product | null>(staticProduct ?? null);
  const [loading, setLoading] = useState(isObjectId);

  useEffect(() => {
    if (!isObjectId) return;
    fetch(`http://localhost:3001/api/products/${id}`)
      .then((r) => { if (!r.ok) throw new Error("not found"); return r.json(); })
      .then((data: BackendProduct) => setProduct(backendToProduct(data)))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id, isObjectId]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState("Large");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"details" | "reviews" | "faqs">("reviews");
  const [addedToCart, setAddedToCart] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const { addItem } = useCart();

  // Backend reviews for this product
  type BackendReview = { _id: string; userName: string; rating: number; comment: string; createdAt: string };
  const [backendReviews, setBackendReviews] = useState<BackendReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    if (!isObjectId) return;
    setReviewsLoading(true);
    fetch(`http://localhost:3001/api/products/${id}/reviews`)
      .then((r) => r.json())
      .then((data) => setBackendReviews(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setReviewsLoading(false));
  }, [id, isObjectId]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: isObjectId ? id as unknown as number : (product.id || 0),
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      image: product.images[0],
      size: selectedSize,
      color: product.colors?.[selectedColor] ?? "Default",
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  const reviews = product ? (productReviews[(product as Product & { id: number }).id] ?? []) : [];
  const relatedProducts = youMightAlsoLike.map((rid) => products.find((p) => p.id === rid)).filter(Boolean);

  if (loading) {
    return (
      <>
        <AnnouncementBanner />
        <Navbar />
        <main className="bg-white min-h-screen flex items-center justify-center">
          <p className="text-black/40 text-lg">Loading product…</p>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <AnnouncementBanner />
        <Navbar />
        <main className="bg-white min-h-screen flex items-center justify-center">
          <p className="text-black/40 text-lg">Product not found.</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <AnnouncementBanner />
      <Navbar />

      <main className="bg-white min-h-screen">
        <div className="max-w-[1440px] mx-auto px-4 md:px-[100px]">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 py-5 text-sm" style={{ fontFamily: "'Satoshi', sans-serif" }}>
            {["Home", "Shop", product.category ?? "Products"].map((crumb, i, arr) => (
              <span key={crumb} className="flex items-center gap-2">
                {i < arr.length - 1 ? (
                  <>
                    <Link href="/" className="text-black/60 hover:text-black transition-colors">{crumb}</Link>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="rgba(0,0,0,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </>
                ) : (
                  <span className="text-black font-medium">{crumb}</span>
                )}
              </span>
            ))}
          </nav>

          <div className="border-t border-black/10 mb-8" />

          {/* Product section */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-10">

            {/* Left: images */}
            <div className="flex flex-col-reverse md:flex-row gap-4 md:w-[550px] shrink-0">
              {/* Thumbnails */}
              <div className="flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-y-auto">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`shrink-0 w-[110px] h-[120px] rounded-[20px] overflow-hidden border-2 transition-colors ${selectedImage === i ? "border-black" : "border-transparent"}`}
                  >
                    <div className="relative w-full h-full bg-[#F0EEED]">
                      <Image src={img} alt={`${product.name} view ${i + 1}`} fill className="object-cover object-top" />
                    </div>
                  </button>
                ))}
              </div>
              {/* Main image */}
              <div className="relative flex-1 min-h-[400px] md:min-h-[530px] bg-[#F0EEED] rounded-[20px] overflow-hidden">
                <Image src={product.images[selectedImage]} alt={product.name} fill className="object-cover object-top" />
              </div>
            </div>

            {/* Right: info */}
            <div className="flex-1 flex flex-col gap-5" style={{ fontFamily: "'Satoshi', sans-serif" }}>
              <h1 className="font-bold text-[32px] md:text-[40px] leading-[1.2] text-black" style={{ fontFamily: "'Integral CF', sans-serif" }}>
                {product.name}
              </h1>

              <div className="flex items-center gap-4">
                <StarRating rating={product.rating} size={25} />
                <span className="text-base text-black">{product.rating}/5</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-bold text-[32px] leading-[43px] text-black">${product.price}</span>
                {product.originalPrice && (
                  <span className="font-bold text-[32px] leading-[43px] text-black/30 line-through">${product.originalPrice}</span>
                )}
                {product.discount && (
                  <span className="bg-[#FF33331A] text-[#FF3333] font-medium text-base px-3.5 py-1.5 rounded-full">-{product.discount}%</span>
                )}
              </div>

              <p className="text-black/60 text-base leading-[22px] max-w-[590px]">{product.description}</p>

              {/* Divider */}
              <div className="border-t border-black/10" />

              {/* Colors */}
              <div className="flex flex-col gap-4">
                <span className="text-black/60 text-base">Select Colors</span>
                <div className="flex items-center gap-4">
                  {product.colors.map((color, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedColor(i)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${selectedColor === i ? "ring-2 ring-offset-2 ring-black" : ""}`}
                      style={{ backgroundColor: color }}
                    >
                      {selectedColor === i && (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M3 8L6.5 11.5L13 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-black/10" />

              {/* Sizes */}
              <div className="flex flex-col gap-4">
                <span className="text-black/60 text-base">Choose Size</span>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 rounded-full text-base font-medium transition-colors ${selectedSize === size ? "bg-black text-white" : "bg-[#F0F0F0] text-black/60 hover:bg-black/10"}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-black/10" />

              {/* Quantity + Add to Cart */}
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-5 bg-[#F0F0F0] rounded-full px-5 py-4">
                  <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="text-black hover:opacity-60 transition-opacity">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 12H19" stroke="black" strokeWidth="2" strokeLinecap="round" /></svg>
                  </button>
                  <span className="font-medium text-black text-base w-5 text-center">{quantity}</span>
                  <button onClick={() => setQuantity((q) => q + 1)} className="text-black hover:opacity-60 transition-opacity">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 5V19M5 12H19" stroke="black" strokeWidth="2" strokeLinecap="round" /></svg>
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-black text-white font-medium text-base rounded-full py-4 hover:opacity-80 transition-opacity"
                >
                  {addedToCart ? "Added!" : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-16">
            <div className="flex border-b border-black/10">
              {(["details", "reviews", "faqs"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-5 text-base md:text-xl font-medium capitalize transition-colors ${activeTab === tab ? "text-black border-b-2 border-black -mb-px" : "text-black/60"}`}
                  style={{ fontFamily: "'Satoshi', sans-serif" }}
                >
                  {tab === "details" ? "Product Details" : tab === "reviews" ? "Rating & Reviews" : "FAQs"}
                </button>
              ))}
            </div>

            {activeTab === "reviews" && (
              <div className="py-8 flex flex-col gap-6">
                {/* Reviews header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h3 className="font-bold text-[24px] leading-[32px] text-black" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                    All Reviews{" "}
                    <span className="text-black/60 font-normal text-base">
                      ({isObjectId ? backendReviews.length : (product.reviewCount ?? 0)})
                    </span>
                  </h3>
                  <button
                    onClick={() => setReviewModalOpen(true)}
                    className="bg-black text-white rounded-full px-5 py-3 text-base font-medium hover:opacity-80 transition-opacity"
                    style={{ fontFamily: "'Satoshi', sans-serif" }}
                  >
                    Write a Review
                  </button>
                </div>

                {/* Review grid */}
                {isObjectId ? (
                  reviewsLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[1, 2].map((i) => <div key={i} className="h-32 rounded-[24px] bg-[#F0F0F0] animate-pulse" />)}
                    </div>
                  ) : backendReviews.length === 0 ? (
                    <p className="text-black/40 text-sm">No reviews yet. Be the first to review!</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {backendReviews.map((r) => (
                        <ReviewCard
                          key={r._id}
                          name={r.userName}
                          rating={r.rating}
                          date={new Date(r.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                          review={r.comment}
                          showMenu={false}
                        />
                      ))}
                    </div>
                  )
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reviews.map((r) => (
                      <ReviewCard key={r.id} {...r} showMenu={true} />
                    ))}
                  </div>
                )}

                {/* Load More (static only) */}
                {!isObjectId && reviews.length > 0 && (
                  <div className="flex justify-center mt-4">
                    <button className="border border-black/10 text-black font-medium text-base rounded-full px-14 py-4 hover:bg-black hover:text-white transition-colors" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                      Load More Reviews
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "details" && (
              <div className="py-8 text-black/60 text-base leading-[22px]" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                <p>{product.description}</p>
              </div>
            )}

            {activeTab === "faqs" && (
              <div className="py-8 text-black/60 text-base leading-[22px]" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                <p>Frequently asked questions about this product will appear here.</p>
              </div>
            )}
          </div>

          {/* You Might Also Like */}
          <div className="py-14">
            <h2 className="text-black font-extrabold text-[32px] md:text-[48px] text-center uppercase mb-12" style={{ fontFamily: "'Integral CF', sans-serif" }}>
              You Might Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 justify-items-center">
              {relatedProducts.map((p) => p && <ProductCard key={p.id} name={p.name} price={p.price} originalPrice={p.originalPrice} discount={p.discount} rating={p.rating} image={p.images[0]} href={`/products/${p.id}`} />)}
            </div>
          </div>

        </div>
      </main>

      <Footer />

      {/* Write a Review Modal */}
      {reviewModalOpen && (
        <WriteReviewModal
          productId={id}
          onClose={() => setReviewModalOpen(false)}
          onSuccess={() => {
            // Refresh reviews for backend products
            if (isObjectId) {
              setReviewsLoading(true);
              fetch(`http://localhost:3001/api/products/${id}/reviews`)
                .then((r) => r.json())
                .then((data) => setBackendReviews(Array.isArray(data) ? data : []))
                .catch(() => {})
                .finally(() => setReviewsLoading(false));
            }
          }}
        />
      )}
    </>
  );
}
