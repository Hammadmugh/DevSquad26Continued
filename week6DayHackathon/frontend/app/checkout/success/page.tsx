"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

function CheckCircleIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="30" fill="#DCFCE7" stroke="#16A34A" strokeWidth="2" />
      <path d="M20 32L28 40L44 24" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg className="animate-spin" width="48" height="48" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="20" stroke="#E5E7EB" strokeWidth="4" />
      <path d="M44 24A20 20 0 0 0 24 4" stroke="#111" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function SuccessInner() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart, isNewUser, markFirstOrderUsed } = useCart() as any;
  const { refreshUser } = useAuth();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) { setStatus("error"); return; }

    const token = localStorage.getItem("shopco_token");
    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"}/api/orders/stripe/session/${sessionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.status === "paid" || data.status === "complete") {
          setOrderId(data.orderId);
          setStatus("success");
          clearCart?.();
          if (isNewUser) markFirstOrderUsed?.();
          refreshUser?.();
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return (
    <>
      <AnnouncementBanner />
      <Navbar />
      <main className="bg-white min-h-screen flex items-center justify-center py-16 px-4">
        <div className="flex flex-col items-center gap-6 max-w-md text-center">
          {status === "loading" && (
            <>
              <SpinnerIcon />
              <p className="text-black/60 text-base">Confirming your payment…</p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircleIcon />
              <div className="flex flex-col gap-2">
                <h1
                  className="text-[32px] font-bold text-black uppercase"
                  style={{ fontFamily: "'Integral CF', sans-serif" }}
                >
                  Payment Successful!
                </h1>
                <p className="text-black/60 text-base">
                  Your order has been placed and your payment was processed securely via Stripe.
                </p>
              </div>

              <div className="w-full border border-black/10 rounded-[16px] p-5 flex flex-col gap-3 text-left">
                {orderId && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-black/60">Order ID</span>
                    <span className="text-sm font-semibold text-black font-mono">
                      #{orderId.slice(-8).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-black/60">Payment</span>
                  <span className="text-sm font-semibold text-black">Stripe</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-black/60">Status</span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                    Paid
                  </span>
                </div>
              </div>

              <Link
                href="/"
                className="w-full bg-black text-white font-medium text-base rounded-full py-4 text-center hover:opacity-80 transition-opacity"
              >
                Continue Shopping
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M8 8L24 24M24 8L8 24" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="flex flex-col gap-2">
                <h1
                  className="text-[32px] font-bold text-black uppercase"
                  style={{ fontFamily: "'Integral CF', sans-serif" }}
                >
                  Something went wrong
                </h1>
                <p className="text-black/60 text-base">
                  We could not confirm your payment. If you were charged, please contact support.
                </p>
              </div>
              <Link
                href="/checkout"
                className="w-full bg-black text-white font-medium text-base rounded-full py-4 text-center hover:opacity-80 transition-opacity"
              >
                Try Again
              </Link>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense>
      <SuccessInner />
    </Suspense>
  );
}
