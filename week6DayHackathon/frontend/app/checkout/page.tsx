"use client";

import { useState, Suspense, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "");

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

type AddressState = {
  fullName: string; phone: string; addressLine1: string; addressLine2: string;
  city: string; state: string; postalCode: string; country: string;
};
const EMPTY_ADDRESS: AddressState = {
  fullName: "", phone: "", addressLine1: "", addressLine2: "",
  city: "", state: "", postalCode: "", country: "",
};

function PaymentForm({ onSuccess, onError }: {
  onSuccess: (paymentIntentId: string) => void;
  onError: (msg: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });
    if (error) {
      onError(error.message ?? "Payment failed.");
      setSubmitting(false);
    } else if (paymentIntent?.status === "succeeded") {
      onSuccess(paymentIntent.id);
    } else {
      onError("Payment did not complete.");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <PaymentElement options={{ layout: "tabs" }} />
      <div className="flex items-center gap-2 px-3 py-2 bg-black/5 rounded-[10px]">
        <p className="text-xs text-black/40">
          Test card: <span className="font-mono">4242 4242 4242 4242</span> &middot; any future date &middot; any CVV
        </p>
      </div>
      <button
        type="submit"
        disabled={!stripe || submitting}
        className="w-full bg-black text-white font-medium text-base rounded-full py-4 flex items-center justify-center gap-2 hover:opacity-80 transition-opacity disabled:opacity-40"
      >
        <LockIcon />
        {submitting ? "Processing..." : "Confirm & Pay"}
      </button>
    </form>
  );
}

type OrderSummaryProps = {
  items: ReturnType<typeof useCart>["items"];
  subtotal: number; itemDiscountSavings: number; newUserDiscount: number;
  promoApplied: boolean; promoDiscount: number; pointsToRedeem: number;
  pointsDiscount: number; total: number; DELIVERY_FEE: number; isNewUser: boolean;
};

function OrderSummary({
  items, subtotal, itemDiscountSavings, newUserDiscount,
  promoApplied, promoDiscount, pointsToRedeem, pointsDiscount,
  total, DELIVERY_FEE, isNewUser,
}: OrderSummaryProps) {
  return (
    <div className="border border-black/10 rounded-[20px] p-6 flex flex-col gap-5 sticky top-6">
      <h2 className="font-bold text-[20px] text-black">Order Summary</h2>
      <div className="flex flex-col gap-4 max-h-[360px] overflow-y-auto pr-1">
        {items.length === 0 ? (
          <p className="text-sm text-black/40">No items in cart.</p>
        ) : items.map((item) => (
          <div key={`${item.id}-${item.size}-${item.color}`} className="flex items-center gap-3">
            <div className="w-[64px] h-[64px] shrink-0 rounded-[8px] overflow-hidden bg-[#F0EEED]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.name} className="w-full h-full object-cover object-top" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-black truncate">{item.name}</p>
              <p className="text-xs text-black/50">{item.size} &middot; {item.color} &middot; x{item.quantity}</p>
              {item.discount && (
                <span className="inline-block mt-0.5 text-[10px] font-medium text-[#FF3333] bg-[#FF33331A] px-1.5 py-0.5 rounded-full">
                  -{item.discount}% OFF
                </span>
              )}
            </div>
            <div className="flex flex-col items-end shrink-0">
              <span className="text-sm font-semibold text-black">${(item.price * item.quantity).toFixed(2)}</span>
              {item.originalPrice && (
                <span className="text-xs text-black/40 line-through">${(item.originalPrice * item.quantity).toFixed(2)}</span>
              )}
            </div>
          </div>
        ))}
      </div>
      <hr className="border-black/10" />
      <div className="flex flex-col gap-3">
        <div className="flex justify-between text-base text-black/60"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
        {itemDiscountSavings > 0 && <div className="flex justify-between text-base text-[#FF3333]"><span>Product Discounts</span><span>-${itemDiscountSavings.toFixed(2)}</span></div>}
        {isNewUser && newUserDiscount > 0 && <div className="flex justify-between text-base text-[#FF3333]"><span>First Order (-20%)</span><span>-${newUserDiscount.toFixed(2)}</span></div>}
        {promoApplied && promoDiscount > 0 && <div className="flex justify-between text-base text-[#FF3333]"><span>Promo (SHOP20)</span><span>-${promoDiscount.toFixed(2)}</span></div>}
        {pointsToRedeem > 0 && <div className="flex justify-between text-base text-[#1D4ED8]"><span>Points ({pointsToRedeem} pts)</span><span>-${pointsDiscount.toFixed(2)}</span></div>}
        <div className="flex justify-between text-base text-black/60"><span>Delivery</span><span>${DELIVERY_FEE}</span></div>
        <hr className="border-black/10" />
        <div className="flex justify-between text-[20px] font-bold text-black"><span>Total</span><span>${total.toFixed(2)}</span></div>
      </div>
    </div>
  );
}

function CheckoutInner() {
  const searchParams = useSearchParams();
  const cancelled = searchParams.get("cancelled") === "true";
  const { items, clearCart, promoApplied } = useCart();
  const { user, openAuthModal, isNewUser, markFirstOrderUsed, refreshUser } = useAuth();

  const [step, setStep] = useState<"shipping" | "payment" | "success">("shipping");
  const [address, setAddress] = useState<AddressState>(EMPTY_ADDRESS);
  const [clientSecret, setClientSecret] = useState("");
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState(cancelled ? "Payment was cancelled." : "");
  const [completedOrder, setCompletedOrder] = useState<{ id: string; pointsEarned: number } | null>(null);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [redeemInput, setRedeemInput] = useState("");

  const POINTS_TO_DOLLAR = 100;
  const DELIVERY_FEE = 15;
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemDiscountSavings = items.reduce((sum, i) => i.originalPrice ? sum + (i.originalPrice - i.price) * i.quantity : sum, 0);
  const newUserDiscount = isNewUser ? Math.round(subtotal * 0.20) : 0;
  const promoDiscount = promoApplied ? Math.round(subtotal * 0.20) : 0;
  const pointsDiscount = parseFloat((pointsToRedeem / POINTS_TO_DOLLAR).toFixed(2));
  const totalDiscount = itemDiscountSavings + newUserDiscount + promoDiscount + pointsDiscount;
  const total = Math.max(0, subtotal - newUserDiscount - promoDiscount - pointsDiscount + DELIVERY_FEE);
  const isFullyCoveredByPoints = total <= 0;

  const validateAddress = (): boolean => {
    if (!address.fullName || !address.phone || !address.addressLine1 || !address.city || !address.state || !address.postalCode || !address.country) {
      setError("Please fill in all required shipping address fields.");
      return false;
    }
    setError("");
    return true;
  };

  const shippingPayload = () => ({
    fullName: address.fullName, phone: address.phone, addressLine1: address.addressLine1,
    ...(address.addressLine2 ? { addressLine2: address.addressLine2 } : {}),
    city: address.city, state: address.state, postalCode: address.postalCode, country: address.country,
  });

  const itemsPayload = () => items.map((item) => ({
    name: item.name, image: item.image || undefined, price: Number(item.price),
    size: item.size || undefined, color: item.color || undefined,
    quantity: Number(item.quantity), productId: String(item.id),
  }));

  const handleFreeCheckout = async () => {
    if (!user) { openAuthModal("login"); return; }
    if (!validateAddress()) return;
    setPaying(true); setError("");
    try {
      const token = localStorage.getItem("shopco_token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ items: itemsPayload(), discount: totalDiscount, pointsRedeemed: pointsToRedeem, shippingAddress: shippingPayload() }),
      });
      if (!res.ok) throw new Error("Order failed");
      const data = await res.json();
      clearCart();
      if (isNewUser) markFirstOrderUsed();
      await refreshUser();
      setCompletedOrder({ id: data._id ?? "ORD-" + Date.now(), pointsEarned: data.pointsEarned ?? 0 });
      setStep("success");
    } catch { setError("Order failed. Please try again."); }
    finally { setPaying(false); }
  };

  const handleContinueToPayment = async () => {
    if (!user) { openAuthModal("login"); return; }
    if (items.length === 0) { setError("Your cart is empty."); return; }
    if (!validateAddress()) return;
    setPaying(true); setError("");
    try {
      const token = localStorage.getItem("shopco_token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"}/api/orders/stripe/payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ items: itemsPayload(), discount: Number(totalDiscount.toFixed(2)), pointsRedeemed: Number(pointsToRedeem), shippingAddress: shippingPayload() }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(Array.isArray(d.message) ? d.message.join("; ") : (d.message ?? "Could not initialise payment."));
      }
      const { clientSecret: cs } = await res.json();
      setClientSecret(cs);
      setStep("payment");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not start payment. Please try again.");
    } finally { setPaying(false); }
  };

  const handlePaymentSuccess = useCallback(async (piId: string) => {
    clearCart();
    if (isNewUser) markFirstOrderUsed();
    await refreshUser();
    setCompletedOrder({ id: piId, pointsEarned: Math.floor(subtotal - newUserDiscount - promoDiscount) });
    setStep("success");
  }, [clearCart, isNewUser, markFirstOrderUsed, refreshUser, subtotal, newUserDiscount, promoDiscount]);

  const inp = "w-full border border-black/20 rounded-xl px-4 py-3 text-base text-black focus:outline-none focus:border-black transition-colors";

  if (step === "success") {
    return (
      <>
        <AnnouncementBanner />
        <Navbar />
        <main className="bg-white min-h-screen flex items-center justify-center py-16 px-4">
          <div className="flex flex-col items-center gap-6 max-w-md text-center">
            <CheckCircleIcon />
            <div className="flex flex-col gap-2">
              <h1 className="text-[32px] font-bold text-black uppercase" style={{ fontFamily: "'Integral CF', sans-serif" }}>Order Placed!</h1>
              <p className="text-black/60 text-base">Thank you for your purchase. Your order has been received.</p>
            </div>
            <div className="w-full border border-black/10 rounded-[16px] p-5 flex flex-col gap-3 text-left">
              <div className="flex justify-between items-center">
                <span className="text-sm text-black/60">Reference</span>
                <span className="text-sm font-semibold text-black font-mono">{completedOrder?.id.slice(-10).toUpperCase()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-black/60">Status</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">Paid</span>
              </div>
              {(completedOrder?.pointsEarned ?? 0) > 0 && (
                <div className="flex items-center justify-between pt-2 border-t border-black/10">
                  <span className="text-sm text-[#1D4ED8]">Loyalty Points Earned</span>
                  <span className="text-sm font-bold text-[#1D4ED8]">+{completedOrder?.pointsEarned} pts</span>
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
          <nav className="flex items-center gap-3 mb-6 text-base">
            <Link href="/" className="text-black/60 hover:text-black transition-colors">Home</Link>
            <span className="text-black/40">/</span>
            <Link href="/cart" className="text-black/60 hover:text-black transition-colors">Cart</Link>
            <span className="text-black/40">/</span>
            <span className="text-black font-medium">Checkout</span>
          </nav>

          <div className="flex items-center gap-3 mb-6">
            <div className={`flex items-center gap-2 text-sm font-medium ${step === "shipping" ? "text-black" : "text-black/40"}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === "shipping" ? "bg-black text-white" : "bg-black/10 text-black/40"}`}>1</span>
              Shipping
            </div>
            <span className="text-black/20 text-sm">&#x203A;</span>
            <div className={`flex items-center gap-2 text-sm font-medium ${step === "payment" ? "text-black" : "text-black/40"}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === "payment" ? "bg-black text-white" : "bg-black/10 text-black/40"}`}>2</span>
              Payment
            </div>
          </div>

          <h1 className="font-bold text-[32px] md:text-[40px] leading-[1.2] text-black mb-8 uppercase" style={{ fontFamily: "'Integral CF', sans-serif" }}>
            {step === "payment" ? "Payment" : "Checkout"}
          </h1>

          <div className="flex flex-col md:flex-row gap-5">
            <div className="flex-1">
              {step === "shipping" && (
                <div className="flex flex-col gap-6">
                  <div className="border border-black/10 rounded-[20px] p-6 flex flex-col gap-5">
                    <h2 className="font-bold text-[20px] text-black">Shipping Address</h2>
                    <div className="flex flex-col gap-4">
                      <div className="flex gap-4">
                        <div className="flex flex-col gap-1.5 flex-1">
                          <label className="text-sm font-medium text-black/70">Full Name</label>
                          <input type="text" required placeholder="John Doe" value={address.fullName} onChange={(e) => setAddress((a) => ({ ...a, fullName: e.target.value }))} className={inp} />
                        </div>
                        <div className="flex flex-col gap-1.5 flex-1">
                          <label className="text-sm font-medium text-black/70">Phone</label>
                          <input type="tel" required placeholder="+1 555 000 0000" value={address.phone} onChange={(e) => setAddress((a) => ({ ...a, phone: e.target.value }))} className={inp} />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-black/70">Address Line 1</label>
                        <input type="text" required placeholder="Street, building, flat no." value={address.addressLine1} onChange={(e) => setAddress((a) => ({ ...a, addressLine1: e.target.value }))} className={inp} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-black/70">Address Line 2 <span className="text-black/40">(optional)</span></label>
                        <input type="text" placeholder="Landmark, area..." value={address.addressLine2} onChange={(e) => setAddress((a) => ({ ...a, addressLine2: e.target.value }))} className={inp} />
                      </div>
                      <div className="flex gap-4">
                        <div className="flex flex-col gap-1.5 flex-1">
                          <label className="text-sm font-medium text-black/70">City</label>
                          <input type="text" required placeholder="New York" value={address.city} onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))} className={inp} />
                        </div>
                        <div className="flex flex-col gap-1.5 flex-1">
                          <label className="text-sm font-medium text-black/70">State</label>
                          <input type="text" required placeholder="NY" value={address.state} onChange={(e) => setAddress((a) => ({ ...a, state: e.target.value }))} className={inp} />
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex flex-col gap-1.5 flex-1">
                          <label className="text-sm font-medium text-black/70">Postal Code</label>
                          <input type="text" required placeholder="10001" value={address.postalCode} onChange={(e) => setAddress((a) => ({ ...a, postalCode: e.target.value.replace(/\D/g, "").slice(0, 10) }))} className={inp} />
                        </div>
                        <div className="flex flex-col gap-1.5 flex-1">
                          <label className="text-sm font-medium text-black/70">Country</label>
                          <input type="text" required placeholder="United States" value={address.country} onChange={(e) => setAddress((a) => ({ ...a, country: e.target.value }))} className={inp} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {user && (user.loyaltyPoints ?? 0) >= POINTS_TO_DOLLAR && (
                    <div className="flex flex-col gap-3 border border-[#BFDBFE] rounded-[16px] bg-[#EFF6FF] p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-[#1D4ED8]">{user.loyaltyPoints} pts available</span>
                        <span className="text-xs text-[#3B82F6]">100 pts = $1</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number" min={0}
                          max={Math.min(user.loyaltyPoints ?? 0, Math.round((subtotal - newUserDiscount - promoDiscount) * POINTS_TO_DOLLAR))}
                          step={POINTS_TO_DOLLAR} placeholder="Points to redeem" value={redeemInput}
                          onChange={(e) => setRedeemInput(e.target.value)}
                          className="flex-1 border border-[#93C5FD] rounded-[10px] px-3 py-2 text-sm text-black focus:outline-none focus:border-[#2563EB]"
                        />
                        <button type="button"
                          onClick={() => {
                            const pts = Math.min(parseInt(redeemInput || "0"), user.loyaltyPoints ?? 0, Math.round((subtotal - newUserDiscount - promoDiscount) * POINTS_TO_DOLLAR));
                            setPointsToRedeem(isNaN(pts) || pts < 0 ? 0 : pts);
                          }}
                          className="bg-[#2563EB] text-white text-sm font-medium px-3 py-2 rounded-[10px] hover:opacity-80 transition-opacity whitespace-nowrap"
                        >Apply</button>
                        {pointsToRedeem > 0 && (
                          <button type="button" onClick={() => { setPointsToRedeem(0); setRedeemInput(""); }} className="text-[#FF3333] text-sm font-medium hover:opacity-70">Remove</button>
                        )}
                      </div>
                      <p className="text-xs text-[#1D4ED8]">
                        After order: <span className="font-bold">{(user.loyaltyPoints ?? 0) - pointsToRedeem + Math.floor(subtotal - newUserDiscount - promoDiscount)} pts</span>
                      </p>
                    </div>
                  )}

                  {error && <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

                  <button type="button" disabled={paying || items.length === 0}
                    onClick={isFullyCoveredByPoints ? handleFreeCheckout : handleContinueToPayment}
                    className="w-full bg-black text-white font-medium text-base rounded-full py-4 flex items-center justify-center gap-2 hover:opacity-80 transition-opacity disabled:opacity-40"
                  >
                    <LockIcon />
                    {paying ? "Please wait..." : isFullyCoveredByPoints ? "Place Order (Points)" : `Continue to Payment $${total.toFixed(2)}`}
                  </button>
                </div>
              )}

              {step === "payment" && clientSecret && (
                <div className="flex flex-col gap-5">
                  <button type="button" onClick={() => setStep("shipping")} className="flex items-center gap-2 text-sm text-black/50 hover:text-black transition-colors w-fit">
                    &lsaquo; Back to Shipping
                  </button>
                  <div className="border border-black/10 rounded-[20px] p-6 flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                      <h2 className="font-bold text-[20px] text-black">Card Details</h2>
                      <div className="flex items-center gap-1.5 text-black/40 text-xs">
                        <LockIcon />
                        <span>Powered by Stripe</span>
                      </div>
                    </div>
                    <Elements stripe={stripePromise} options={{
                      clientSecret,
                      appearance: {
                        theme: "stripe",
                        variables: { colorPrimary: "#000000", colorBackground: "#ffffff", colorText: "#111111", colorDanger: "#FF3333", borderRadius: "12px", fontSizeBase: "15px" },
                        rules: {
                          ".Input": { border: "1px solid rgba(0,0,0,0.2)", boxShadow: "none", padding: "12px 16px" },
                          ".Input:focus": { border: "1px solid #000", boxShadow: "none" },
                          ".Label": { color: "rgba(0,0,0,0.7)", fontWeight: "500" },
                        },
                      },
                    }}>
                      <PaymentForm onSuccess={handlePaymentSuccess} onError={(msg) => setError(msg)} />
                    </Elements>
                    {error && <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}
                  </div>
                </div>
              )}
            </div>

            <div className="w-full md:w-[400px] shrink-0">
              <OrderSummary items={items} subtotal={subtotal} itemDiscountSavings={itemDiscountSavings}
                newUserDiscount={newUserDiscount} promoApplied={promoApplied} promoDiscount={promoDiscount}
                pointsToRedeem={pointsToRedeem} pointsDiscount={pointsDiscount} total={total}
                DELIVERY_FEE={DELIVERY_FEE} isNewUser={isNewUser}
              />
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