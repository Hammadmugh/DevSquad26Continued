"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

function TrashIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 6H21M8 6V4H16V6M19 6L18 20C18 20.5304 17.7893 21.0391 17.4142 21.4142C17.0391 21.7893 16.5304 22 16 22H8C7.46957 22 6.96086 21.7893 6.58579 21.4142C6.21071 21.0391 6 20.5304 6 20L5 6H19Z" stroke="#FF3333" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function CartPage() {
  const { items, removeItem, updateQty, promoApplied, promoCode, setPromoCode, applyPromo, removePromo } = useCart();
  const { isNewUser, openAuthModal, user } = useAuth();
  const router = useRouter();

  const DELIVERY_FEE = 15;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemDiscountSavings = items.reduce((sum, item) => {
    if (item.originalPrice) return sum + (item.originalPrice - item.price) * item.quantity;
    return sum;
  }, 0);
  const newUserDiscount = isNewUser ? Math.round(subtotal * 0.20) : 0;
  const promoDiscount = promoApplied ? Math.round(subtotal * 0.20) : 0;
  const totalDiscount = newUserDiscount + promoDiscount;
  const total = subtotal - totalDiscount + DELIVERY_FEE;
  // Loyalty points earned = 1 point per $1 spent on products (not delivery)
  const pointsToEarn = Math.floor(subtotal - totalDiscount);

  return (
    <>
      <AnnouncementBanner />
      <Navbar />

      <main className="bg-white min-h-screen" style={{ fontFamily: "'Satoshi', sans-serif" }}>
        <div className="max-w-[1440px] mx-auto px-4 md:px-[100px] py-6">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-3 mb-6 text-base">
            <Link href="/" className="text-black/60 hover:text-black transition-colors">Home</Link>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke="rgba(0,0,0,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-black font-medium">Cart</span>
          </nav>

          {/* Heading */}
          <h1
            className="font-bold text-[32px] md:text-[40px] leading-[1.2] text-black mb-6 uppercase"
            style={{ fontFamily: "'Integral CF', sans-serif" }}
          >
            Your Cart
          </h1>

          {items.length === 0 ? (
            <div className="flex flex-col items-center gap-6 py-24 text-center">
              <p className="text-black/60 text-lg">Your cart is empty.</p>
              <Link
                href="/"
                className="bg-black text-white font-medium px-8 py-4 rounded-full hover:opacity-80 transition-opacity"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-5">

              {/* Cart Items */}
              <div className="flex-1 border border-black/10 rounded-[20px] p-5 md:p-6 flex flex-col gap-6">
                {items.map((item, idx) => (
                  <div key={`${item.id}-${item.size}-${item.color}`}>
                    <div className="flex items-center gap-4">
                      {/* Image */}
                      <div className="w-[100px] h-[100px] md:w-[124px] md:h-[124px] shrink-0 bg-[#F0EEED] rounded-[8px] overflow-hidden relative">
                        <Image src={item.image} alt={item.name} fill className="object-cover object-top" />
                      </div>

                      {/* Info */}
                      <div className="flex flex-1 justify-between items-start gap-2 min-w-0">
                        <div className="flex flex-col gap-1 min-w-0">
                          <h3 className="font-bold text-base md:text-[20px] leading-[1.3] text-black truncate">
                            {item.name}
                          </h3>
                          <div className="flex flex-col gap-1 text-sm text-black/60">
                            <span>
                              <span className="text-black/40">Size: </span>
                              <span className="text-black">{item.size}</span>
                            </span>
                            <span>
                              <span className="text-black/40">Color: </span>
                              <span className="text-black">{item.color}</span>
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-bold text-[20px] md:text-[24px] text-black">
                              ${item.price}
                            </span>
                            {item.originalPrice && (
                              <span className="font-bold text-[16px] md:text-[20px] text-black/30 line-through">
                                ${item.originalPrice}
                              </span>
                            )}
                            {item.discount && (
                              <span className="text-xs font-medium text-[#FF3333] bg-[#FF33331A] px-2 py-0.5 rounded-full">
                                -{item.discount}%
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Delete + quantity */}
                        <div className="flex flex-col items-end justify-between gap-4 shrink-0 h-full self-stretch py-1">
                          <button
                            onClick={() => removeItem(item.id, item.size, item.color)}
                            aria-label="Remove item"
                            className="hover:opacity-70 transition-opacity"
                          >
                            <TrashIcon />
                          </button>

                          {/* Quantity stepper */}
                          <div className="flex items-center gap-4 bg-[#F0F0F0] rounded-full px-4 py-2">
                            <button
                              onClick={() => updateQty(item.id, item.size, item.color, item.quantity - 1)}
                              className="text-black hover:opacity-60 transition-opacity"
                            >
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M5 12H19" stroke="black" strokeWidth="2" strokeLinecap="round" />
                              </svg>
                            </button>
                            <span className="font-medium text-black text-base w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQty(item.id, item.size, item.color, item.quantity + 1)}
                              className="text-black hover:opacity-60 transition-opacity"
                            >
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M12 5V19M5 12H19" stroke="black" strokeWidth="2" strokeLinecap="round" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Divider (not after last item) */}
                    {idx < items.length - 1 && <hr className="border-black/10 mt-6" />}
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="w-full md:w-[505px] shrink-0 border border-black/10 rounded-[20px] p-5 md:p-6 flex flex-col gap-6">
                <h2 className="font-bold text-[24px] text-black">Order Summary</h2>

                <div className="flex flex-col gap-5">
                  <div className="flex justify-between text-[20px]">
                    <span className="text-black/60">Subtotal</span>
                    <span className="font-bold">${subtotal}</span>
                  </div>
                  {itemDiscountSavings > 0 && (
                    <div className="flex justify-between text-[20px]">
                      <span className="text-black/60">Product Discounts</span>
                      <span className="font-bold text-[#FF3333]">-${itemDiscountSavings.toFixed(2)}</span>
                    </div>
                  )}
                  {isNewUser && (
                    <div className="flex justify-between text-[20px]">
                      <span className="text-black/60">First Order Discount (-20%)</span>
                      <span className="font-bold text-[#FF3333]">-${newUserDiscount}</span>
                    </div>
                  )}
                  {promoApplied && (
                    <div className="flex justify-between text-[20px]">
                      <span className="text-black/60">Promo Discount (-20%)</span>
                      <span className="font-bold text-[#FF3333]">-${promoDiscount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[20px]">
                    <span className="text-black/60">Delivery Fee</span>
                    <span className="font-bold">${DELIVERY_FEE}</span>
                  </div>

                  <hr className="border-black/10" />

                  <div className="flex justify-between items-center">
                    <span className="text-[20px] text-black">Total</span>
                    <span className="font-bold text-[24px] text-black">${total}</span>
                  </div>
                </div>

                {/* Promo code */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 flex items-center gap-3 bg-[#F0F0F0] rounded-full px-4 py-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M20.59 13.41L13.42 20.58C13.2343 20.766 13.013 20.9135 12.7696 21.0141C12.5261 21.1148 12.2651 21.1666 12.0016 21.1666C11.7381 21.1666 11.477 21.1148 11.2336 21.0141C10.9901 20.9135 10.7689 20.766 10.5832 20.58L2 12V2H12L20.59 10.59C20.9625 10.9647 21.1716 11.4716 21.1716 12C21.1716 12.5284 20.9625 13.0353 20.59 13.41Z" stroke="rgba(0,0,0,0.4)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M7 7H7.01" stroke="rgba(0,0,0,0.4)" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Add promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-base text-black placeholder:text-black/40"
                    />
                  </div>
                  {promoApplied ? (
                    <button
                      onClick={removePromo}
                      className="bg-[#FF3333] text-white font-medium text-base px-6 py-3 rounded-full hover:opacity-80 transition-opacity whitespace-nowrap"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        const ok = applyPromo();
                        if (!ok) alert("Invalid promo code. Try SHOP20");
                      }}
                      className="bg-black text-white font-medium text-base px-6 py-3 rounded-full hover:opacity-80 transition-opacity whitespace-nowrap"
                    >
                      Apply
                    </button>
                  )}
                </div>

                {/* Sign-in nudge for guests */}
                {!user && (
                  <div className="flex items-center gap-3 bg-[#FFFBEB] border border-[#FDE68A] rounded-[12px] px-4 py-3">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
                      <path d="M10 1L12.39 6.26L18 7.27L14 11.14L14.76 17L10 14.27L5.24 17L6 11.14L2 7.27L7.61 6.26L10 1Z" stroke="#D97706" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                    <p className="text-sm text-[#92400E]">
                      <button
                        onClick={() => openAuthModal("register")}
                        className="font-semibold underline hover:opacity-70 transition-opacity"
                      >
                        Sign up
                      </button>{" "}
                      to get 20% off your first order!
                    </p>
                  </div>
                )}

                {/* Loyalty points preview */}
                {pointsToEarn > 0 && (
                  <div className="flex items-center gap-2 text-sm text-[#1D4ED8] bg-[#EFF6FF] border border-[#BFDBFE] rounded-[12px] px-4 py-3">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="shrink-0">
                      <path d="M10 1L12.39 6.26L18 7.27L14 11.14L14.76 17L10 14.27L5.24 17L6 11.14L2 7.27L7.61 6.26L10 1Z" fill="#2563EB" strokeWidth="0.5" strokeLinejoin="round" />
                    </svg>
                    You&apos;ll earn <span className="font-bold">{pointsToEarn} loyalty points</span> on this order!
                  </div>
                )}

                {/* Checkout */}
                <button
                  onClick={() => router.push("/checkout")}
                  className="w-full bg-black text-white font-medium text-base rounded-full py-4 flex items-center justify-center gap-3 hover:opacity-80 transition-opacity"
                >
                  Go to Checkout
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12H19M12 5L19 12L12 19" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}
