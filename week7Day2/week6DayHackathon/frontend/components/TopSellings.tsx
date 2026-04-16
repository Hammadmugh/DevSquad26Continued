"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import ProductCard from "./ProductCard";

type ApiProduct = {
  _id: string;
  name: string;
  price: number;
  salePrice?: number | null;
  onSale?: boolean;
  rating: number;
  reviewCount?: number;
  images: string[];
};

type ProductItem = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  image: string;
  href: string;
};

const FALLBACK: ProductItem[] = [
  { id: "1", name: "T-shirt with Tape Details", price: 120, rating: 4.5, image: "/new-arrival-1.png", href: "/products/1" },
  { id: "2", name: "Skinny Fit Jeans", price: 240, originalPrice: 260, discount: 20, rating: 3.5, image: "/new-arrival-2.png", href: "/products/2" },
  { id: "3", name: "Checkered Shirt", price: 180, rating: 4.5, image: "/new-arrival-3.png", href: "/products/3" },
  { id: "4", name: "Sleeve Striped T-shirt", price: 130, originalPrice: 160, discount: 37, rating: 4.5, image: "/new-arrival-4.png", href: "/products/4" },
];

export default function TopSellings() {
  const [items, setItems] = useState<ProductItem[]>(FALLBACK);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"}/api/products`)
      .then((r) => r.json())
      .then((data: ApiProduct[]) => {
        if (!Array.isArray(data) || data.length === 0) return;
        const mapped = [...data]
          .sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
          .slice(0, 4)
          .map((p) => {
            const displayPrice = p.onSale && p.salePrice ? p.salePrice : p.price;
            const originalPrice = p.onSale && p.salePrice ? p.price : undefined;
            const discount = originalPrice ? Math.round((1 - displayPrice / originalPrice) * 100) : undefined;
            return {
              id: p._id,
              name: p.name,
              price: displayPrice,
              originalPrice,
              discount,
              rating: p.rating ?? 4,
              image: p.images?.[0] ?? "/new-arrival-1.png",
              href: `/products/${p._id}`,
            };
          });
        setItems(mapped);
      })
      .catch(() => {});
  }, []);
  return (
    <section className="w-full bg-white py-12 md:py-16 px-4 md:px-[100px]">
      {/* Heading */}
      <h2
        className="text-black font-extrabold text-[32px] md:text-[48px] leading-tight text-center uppercase mb-10 md:mb-14"
        style={{ fontFamily: "'Integral CF', sans-serif" }}
      >
        Top Selling
      </h2>

      {/* Desktop grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-5 justify-items-center">
        {items.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>

      {/* Mobile swiper */}
      <div className="md:hidden">
        <Swiper
          modules={[Pagination]}
          spaceBetween={16}
          slidesPerView={1.3}
          centeredSlides={false}
          pagination={{ clickable: true }}
          className="!pb-10"
        >
          {items.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard {...product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* View All button */}
      <div className="flex justify-center mt-10 md:mt-14">
        <Link
          href="/category/top-selling"
          className="border border-black/20 text-black text-base font-medium rounded-full px-[72px] py-[15px] hover:bg-black hover:text-white transition-colors"
          style={{ fontFamily: "'Satoshi', sans-serif" }}
        >
          View All
        </Link>
      </div>
    </section>
  );
}
