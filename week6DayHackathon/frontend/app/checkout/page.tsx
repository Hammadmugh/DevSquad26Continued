"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

/* â”€â”€ Icons â”€â”€ */
function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="3" y="7" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
function CheckCircleIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="30" fill="#DCFCE7" stroke="#16A34A" strokeWidth="2" />
      <path d="M20 32L28 40L44 24" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function StripeIcon() {
  return (
    <svg width="40" height="18" viewBox="0 0 40 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.5 6.3c0-1.1.9-1.5 2.3-1.5 2 0 4.6.6 6.6 1.7V2C24.2.7 21.9 0 19.8 0 14.8 0 11.5 2.6 11.5 6.6c0 6.4 8.8 5.4 8.8 8.2 0 1.3-1.1 1.7-2.6 1.7-2.3 0-5.1-.9-7.4-2.2v4.5c2.5 1.1 5.1 1.6 7.4 1.6 5.1 0 8.7-2.5 8.7-6.6-.1-6.9-8.9-5.7-8.9-7.5zM0 17.8h5V.4H0v17.4zm37.8-17h-4.3l-5.7 17.4h5l1-3.2h5.7l1 3.2H46l-8.2-17.4zm-2.7 10.5l1.8-5.8 1.9 5.8h-3.7z" fill="#6772E5"/>
    </svg>
  );
}

function CheckoutInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cancelled = searchParams.get("cancelled") === "true";

  const { items, clearCart, promoApplied } = useCart();
  const { user, openAuthModal, isNewUser, markFirstOrderUsed, refreshUser } = useAuth();

  const [address, setAddress] = useState({
    fullName: "", phone: "", addressLine1: "", addressLine2: "",
    city: "", state: "", postalCode: "", country: "",
  });
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState(cancelled ? "Payment was cancelled. Your order was not placed." : "");
  const [order, setOrder] = useState<{ id: string; status: string; pointsEarned: number; paymentMethod: string } | null>(null);

  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [redeemInput, setRedeemInput] = useState("");

  const POINTS_TO_DOLLAR = 100; // 100 points = $1
  const DELIVERY_FEE = 15;
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemDiscountSavings = items.reduce((sum, i) => i.originalPrice ? sum + (i.originalPrice - i.price) * i.quantity : sum, 0);
  const newUserDiscount = isNewUser ? Math.round(subtotal * 0.20) : 0;
  const promoDiscount = promoApplied ? Math.round(subtotal * 0.20) : 0;
  const pointsDiscount = parseFloat((pointsToRedeem / POINTS_TO_DOLLAR).toFixed(2));
  const totalDiscount = itemDiscountSavings + newUserDiscount + promoDiscount + pointsDiscount;
  const total = Math.max(0, subtotal - newUserDiscount - promoDiscount - pointsDiscount + DELIVERY_FEE);
  const pointsAfterOrder = (user?.loyaltyPoints ?? 0) - pointsToRedeem + Math.floor(subtotal - newUserDiscount - promoDiscount);

  const isFullyCoveredByPoints = total <= 0;

  const validateAddress = () => {
    if (!address.fullName || !address.phone || !address.addressLine1 || !address.city || !address.state || !address.postalCode || !address.country) {
      setError("Please fill in all required shipping address fields.");
      return false;
    }
    return true;
  };

  /* â”€â”€ Points-only / free checkout â”€â”€ */
  const handleFreeCheckout = async () => {
    if (!user) { openAuthModal("login"); return; }
    if (items.length === 0) { setError("Your cart is empty."); return; }
    if (!validateAddress()) return;

    setPaying(true);
    setError("");
    try {
      const token = localStorage.getItem("shopco_token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          items: items.map((item) => ({
            name: item.name, image: item.image, price: item.price,
            size: item.size, color: item.color, quantity: item.quantity,
            productId: String(item.id),
          })),
          discount: totalDiscount,
          pointsRedeemed: pointsToRedeem,
          shippingAddress: {
            fullName: address.fullName, phone: address.phone,
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2 || undefined,
            city: address.city, state: address.state,
            postalCode: address.postalCode, country: address.country,
          },
        }),
      });
      if (!res.ok) throw new Error("Order failed");
      const data = await res.json();
      clearCart();
      if (isNewUser) markFirstOrderUsed();
      await refreshUser();
      setOrder({ id: data._id ?? "ORD-" + Date.now(), status: data.status ?? "paid", pointsEarned: data.pointsEarned ?? 0, paymentMethod: "points" });
    } catch {
      setError("Order failed. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  /* â”€â”€ Stripe checkout â”€â”€ */
  const handleStripeCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { openAuthModal("login"); return; }
    if (items.length === 0) { setError("Your cart is empty."); return; }
    if (!validateAddress()) return;

    setPaying(true);
    setError("");
    try {
      const token = localStorage.getItem("shopco_token");
      const payload = {
        items: items.map((item) => ({
          name: item.name, image: item.image || undefined, price: Number(item.price),
          size: item.size || undefined, color: item.color || undefined,
          quantity: Number(item.quantity),
          productId: String(item.id),
        })),
        discount: Number(totalDiscount.toFixed(2)),
        pointsRedeemed: Number(pointsToRedeem),
        shippingAddress: {
          fullName: address.fullName, phone: address.phone,
          addressLine1: address.addressLine1,
          ...(address.addressLine2 ? { addressLine2: address.addressLine2 } : {}),
          city: address.city, state: address.state,
          postalCode: address.postalCode, country: address.country,
        },
      };
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"}/api/orders/stripe/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const msg = Array.isArray(errData.message) ? errData.message.join("; ") : (errData.message ?? "Could not create payment session");
        throw new Error(msg);
      }
      const { url } = await res.json();
      if (isNewUser) markFirstOrderUsed();
      window.location.href = url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not start payment. Please try again.");
      setPaying(false);
    }
  };

  /* â”€â”€ Success screen (points-only) â”€â”€ */
  if (order) {
    return (
      <>
        <AnnouncementBanner />
        <Navbar />
        <main className="bg-white min-h-screen flex items-center justify-center py-16 px-4">
          <div className="flex flex-col items-center gap-6 max-w-md text-center">
            <CheckCircleIcon />
            <div className="flex flex-col gap-2">
              <h1 className="text-[32px] font-bold text-black uppercase" style={{ fontFamily: "'Integral CF', sans-serif" }}>
                Order Placed!
              </h1>
              <p className="text-black/60 text-base">Thank you for your purchase. Your order has been received.</p>
            </div>
            <div className="w-full border border-black/10 rounded-[16px] p-5 flex flex-col gap-3 text-left">
              <div className="flex justify-between items-center">
                <span className="text-sm text-black/60">Order ID</span>
                <span className="text-sm font-semibold text-black font-mono">#{order.id.slice(-8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-black/60">Payment</span>
                <span className="text-sm font-semibold text-black capitalize">{order.paymentMethod === "points" ? "Loyalty Points" : "Free"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-black/60">Status</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 capitalize">{order.status}</span>
              </div>
              {order.pointsEarned > 0 && (
                <div className="flex items-center justify-between pt-2 border-t border-black/10">
                  <span className="text-sm text-[#1D4ED8]">Loyalty Points Earned</span>
                  <span className="text-sm font-bold text-[#1D4ED8]">+{order.pointsEarned} pts</span>
                </div>
              )}
            </div>
            <Link href="/" className="w-full bg-black text-white font-medium text-base rounded-full py-4 text-center hover:opacity-80 transition-opacity">
              Continue Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <AnnouncementBanner />
      <Navbar />

      <main className="bg-white min-h-screen" style={{ fontFamily: "'Satoshi', sans-serif" }}>
        <div className="max-w-[1440px] mx-auto px-4 md:px-[100px] py-6">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-3 mb-6 text-base">
            <Link href="/" className="text-black/60 hover:text-black transition-colors">Home</Link>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="rgba(0,0,0,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <Link href="/cart" className="text-black/60 hover:text-black transition-colors">Cart</Link>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="rgba(0,0,0,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span className="text-black font-medium">Checkout</span>
          </nav>

          <h1 className="font-bold text-[32px] md:text-[40px] leading-[1.2] text-black mb-8 uppercase" style={{ fontFamily: "'Integral CF', sans-serif" }}>
            Checkout
          </h1>

          <div className="flex flex-col md:flex-row gap-5">

            {/* â”€â”€ LEFT: Shipping + Payment â”€â”€ */}
            <div className="flex-1">
              <form onSubmit={isFullyCoveredByPoints ? (e) => { e.preventDefault(); handleFreeCheckout(); } : handleStripeCheckout} className="flex flex-col gap-6">

                {/* â”€â”€ Shipping Address â”€â”€ */}
                <div className="border border-black/10 rounded-[20px] p-6 flex flex-col gap-5">
                  <h2 className="font-bold text-[20px] text-black">Shipping Address</h2>
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-4">
                      <div className="flex flex-col gap-1.5 flex-1">
                        <label className="text-sm font-medium text-black/70">Full Name</label>
                        <input type="text" required placeholder="John Doe" value={address.fullName} onChange={(e) => setAddress((a) => ({ ...a, fullName: e.target.value }))} className="w-full border border-black/20 rounded-xl px-4 py-3 text-base text-black focus:outline-none focus:border-black transition-colors" />
                      </div>
                      <div className="flex flex-col gap-1.5 flex-1">
                        <label className="text-sm font-medium text-black/70">Phone</label>
                        <input type="tel" required placeholder="+91 98765 43210" value={address.phone} onChange={(e) => setAddress((a) => ({ ...a, phone: e.target.value }))} className="w-full border border-black/20 rounded-xl px-4 py-3 text-base text-black focus:outline-none focus:border-black transition-colors" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-black/70">Address Line 1</label>
                      <input type="text" required placeholder="Street, building, flat no." value={address.addressLine1} onChange={(e) => setAddress((a) => ({ ...a, addressLine1: e.target.value }))} className="w-full border border-black/20 rounded-xl px-4 py-3 text-base text-black focus:outline-none focus:border-black transition-colors" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-black/70">Address Line 2 <span className="text-black/40">(optional)</span></label>
                      <input type="text" placeholder="Landmark, areaâ€¦" value={address.addressLine2} onChange={(e) => setAddress((a) => ({ ...a, addressLine2: e.target.value }))} className="w-full border border-black/20 rounded-xl px-4 py-3 text-base text-black focus:outline-none focus:border-black transition-colors" />
                    </div>
                    <div className="flex gap-4">
                      <div className="flex flex-col gap-1.5 flex-1">
                        <label className="text-sm font-medium text-black/70">City</label>
                        <input type="text" required placeholder="Mumbai" value={address.city} onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))} className="w-full border border-black/20 rounded-xl px-4 py-3 text-base text-black focus:outline-none focus:border-black transition-colors" />
                      </div>
                      <div className="flex flex-col gap-1.5 flex-1">
                        <label className="text-sm font-medium text-black/70">State</label>
                        <input type="text" required placeholder="Maharashtra" value={address.state} onChange={(e) => setAddress((a) => ({ ...a, state: e.target.value }))} className="w-full border border-black/20 rounded-xl px-4 py-3 text-base text-black focus:outline-none focus:border-black transition-colors" />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex flex-col gap-1.5 flex-1">
                        <label className="text-sm font-medium text-black/70">Postal Code</label>
                        <input type="text" required placeholder="400001" value={address.postalCode} onChange={(e) => setAddress((a) => ({ ...a, postalCode: e.target.value.replace(/\D/g, "").slice(0, 10) }))} className="w-full border border-black/20 rounded-xl px-4 py-3 text-base text-black focus:outline-none focus:border-black transition-colors" />
                      </div>
                      <div className="flex flex-col gap-1.5 flex-1">
                        <label className="text-sm font-medium text-black/70">Country</label>
                        <input type="text" required placeholder="India" value={address.country} onChange={(e) => setAddress((a) => ({ ...a, country: e.target.value }))} className="w-full border border-black/20 rounded-xl px-4 py-3 text-base text-black focus:outline-none focus:border-black transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* â”€â”€ Payment Method â”€â”€ */}
                <div className="border border-black/10 rounded-[20px] p-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold text-[20px] text-black">Payment</h2>
                    <div className="flex items-center gap-2 text-black/40 text-sm"><LockIcon /> Secure & Encrypted</div>
                  </div>

                  {isFullyCoveredByPoints ? (
                    <div className="flex items-center gap-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-[14px] px-4 py-4">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 1L12.39 6.26L18 7.27L14 11.14L14.76 17L10 14.27L5.24 17L6 11.14L2 7.27L7.61 6.26L10 1Z" fill="#2563EB" strokeWidth="0.5" strokeLinejoin="round" />
                      </svg>
                      <div>
                        <p className="text-[14px] font-semibold text-[#1D4ED8]">Paid with Loyalty Points</p>
                        <p className="text-[12px] text-[#3B82F6]">Your points cover the full amount â€” no card needed.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3 bg-[#F5F4FF] border border-[#C4B5FD] rounded-[14px] px-4 py-4">
                        <StripeIcon />
                        <div>
                          <p className="text-[14px] font-semibold text-[#4F46E5]">Secure Card Payment via Stripe</p>
                          <p className="text-[12px] text-[#6B7280]">You will be redirected to Stripe&apos;s secure checkout.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2 bg-black/5 rounded-[10px]">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0">
                          <circle cx="8" cy="8" r="7" stroke="#000" strokeOpacity="0.4" strokeWidth="1.2" />
                          <path d="M8 7v4M8 5v1" stroke="#000" strokeOpacity="0.4" strokeWidth="1.4" strokeLinecap="round" />
                        </svg>
                        <p className="text-xs text-black/40">Test card: 4242 4242 4242 4242 Â· any future date Â· any CVV</p>
                      </div>
                    </div>
                  )}

                  {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>

                <button
                  type="submit"
                  disabled={paying || items.length === 0}
                  className="w-full bg-black text-white font-medium text-base rounded-full py-4 flex items-center justify-center gap-2 hover:opacity-80 transition-opacity disabled:opacity-40"
                >
                  <LockIcon />
                  {paying
                    ? (isFullyCoveredByPoints ? "Placing Orderâ€¦" : "Redirecting to Stripeâ€¦")
                    : isFullyCoveredByPoints
                      ? "Place Order (Free)"
                      : `Pay $${total.toFixed(2)} with Stripe`}
                </button>
              </form>
            </div>

            {/* â”€â”€ RIGHT: Order summary â”€â”€ */}
            <div className="w-full md:w-[400px] shrink-0">
              <div className="border border-black/10 rounded-[20px] p-6 flex flex-col gap-5 sticky top-6">
                <h2 className="font-bold text-[20px] text-black">Order Summary</h2>

                {/* Items */}
                <div className="flex flex-col gap-4 max-h-[360px] overflow-y-auto pr-1">
                  {items.length === 0 ? (
                    <p className="text-sm text-black/40">No items in cart.</p>
                  ) : (
                    items.map((item) => (
                      <div key={`${item.id}-${item.size}-${item.color}`} className="flex items-center gap-3">
                        <div className="w-[64px] h-[64px] shrink-0 rounded-[8px] overflow-hidden bg-[#F0EEED]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover object-top" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-black truncate">{item.name}</p>
                          <p className="text-xs text-black/50">{item.size} Â· {item.color} Â· Ã—{item.quantity}</p>
                          {item.discount && (
                            <span className="inline-block mt-0.5 text-[10px] font-medium text-[#FF3333] bg-[#FF33331A] px-1.5 py-0.5 rounded-full">-{item.discount}% OFF</span>
                          )}
                        </div>
                        <div className="flex flex-col items-end shrink-0">
                          <span className="text-sm font-semibold text-black">${(item.price * item.quantity).toFixed(2)}</span>
                          {item.originalPrice && (
                            <span className="text-xs text-black/40 line-through">${(item.originalPrice * item.quantity).toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <hr className="border-black/10" />

                {/* Totals */}
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between text-base text-black/60"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                  {itemDiscountSavings > 0 && <div className="flex justify-between text-base text-[#FF3333]"><span>Product Discounts</span><span>-${itemDiscountSavings.toFixed(2)}</span></div>}
                  {isNewUser && newUserDiscount > 0 && <div className="flex justify-between text-base text-[#FF3333]"><span>First Order (-20%)</span><span>-${newUserDiscount.toFixed(2)}</span></div>}
                  {promoApplied && promoDiscount > 0 && <div className="flex justify-between text-base text-[#FF3333]"><span>Promo (SHOP20)</span><span>-${promoDiscount.toFixed(2)}</span></div>}
                  {pointsToRedeem > 0 && <div className="flex justify-between text-base text-[#1D4ED8]"><span>Points Redeemed ({pointsToRedeem} pts)</span><span>-${pointsDiscount.toFixed(2)}</span></div>}
                  <div className="flex justify-between text-base text-black/60"><span>Delivery Fee</span><span>${DELIVERY_FEE}</span></div>
                  <hr className="border-black/10" />
                  <div className="flex justify-between text-[20px] font-bold text-black"><span>Total</span><span>${total.toFixed(2)}</span></div>
                </div>

                {/* Loyalty points redemption */}
                {user && (user.loyaltyPoints ?? 0) >= POINTS_TO_DOLLAR && (
                  <div className="flex flex-col gap-3 border border-[#BFDBFE] rounded-[16px] bg-[#EFF6FF] p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                          <path d="M10 1L12.39 6.26L18 7.27L14 11.14L14.76 17L10 14.27L5.24 17L6 11.14L2 7.27L7.61 6.26L10 1Z" fill="#2563EB" strokeWidth="0.5" strokeLinejoin="round" />
                        </svg>
                        <span className="text-sm font-semibold text-[#1D4ED8]">{user.loyaltyPoints} pts available</span>
                      </div>
                      <span className="text-xs text-[#3B82F6]">100 pts = $1</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number" min={0}
                        max={Math.min(user.loyaltyPoints, Math.round((subtotal - newUserDiscount - promoDiscount) * POINTS_TO_DOLLAR))}
                        step={POINTS_TO_DOLLAR} placeholder="Points to redeem" value={redeemInput}
                        onChange={(e) => setRedeemInput(e.target.value)}
                        className="flex-1 border border-[#93C5FD] rounded-[10px] px-3 py-2 text-sm text-black focus:outline-none focus:border-[#2563EB]"
                      />
                      <button type="button"
                        onClick={() => {
                          const pts = Math.min(parseInt(redeemInput || "0"), user.loyaltyPoints, Math.round((subtotal - newUserDiscount - promoDiscount) * POINTS_TO_DOLLAR));
                          setPointsToRedeem(isNaN(pts) || pts < 0 ? 0 : pts);
                        }}
                        className="bg-[#2563EB] text-white text-sm font-medium px-3 py-2 rounded-[10px] hover:opacity-80 transition-opacity whitespace-nowrap"
                      >Apply</button>
                      {pointsToRedeem > 0 && (
                        <button type="button" onClick={() => { setPointsToRedeem(0); setRedeemInput(""); }} className="text-[#FF3333] text-sm font-medium hover:opacity-70">Remove</button>
                      )}
                    </div>
                    {pointsAfterOrder >= 0 && (
                      <p className="text-xs text-[#1D4ED8]">
                        After order: <span className="font-bold">{pointsAfterOrder} pts</span>
                        {" "}(earn {Math.floor(subtotal - newUserDiscount - promoDiscount)} new pts)
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutInner />
    </Suspense>
  );
}
