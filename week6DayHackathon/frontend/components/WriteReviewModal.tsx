"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface Props {
  productId: string;
  onSuccess?: () => void;
  onClose: () => void;
}

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}
          aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
        >
          <svg width="32" height="32" viewBox="0 0 18 18" fill="none">
            <path
              d="M9 1L11.09 6.26L17 7.27L13 11.14L14.18 17L9 14.27L3.82 17L5 11.14L1 7.27L6.91 6.26L9 1Z"
              fill={(hovered || value) >= n ? "#FFC633" : "#E5E7EB"}
            />
          </svg>
        </button>
      ))}
    </div>
  );
}

export default function WriteReviewModal({ productId, onSuccess, onClose }: Props) {
  const { user, token, openAuthModal } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      openAuthModal("login");
      return;
    }
    if (rating === 0) { setError("Please select a star rating."); return; }
    if (!comment.trim()) { setError("Please write a comment."); return; }

    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"}/api/products/${productId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment: comment.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? "Failed to submit review");
      }
      setDone(true);
      onSuccess?.();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center px-4"
      style={{ fontFamily: "'Satoshi', sans-serif" }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-[480px] bg-white rounded-[24px] p-6 flex flex-col gap-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-[22px] text-black">Write a Review</h2>
          <button onClick={onClose} className="text-black/40 hover:text-black transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M2 2L18 18M18 2L2 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {done ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
              <circle cx="28" cy="28" r="26" fill="#DCFCE7" stroke="#16A34A" strokeWidth="2" />
              <path d="M18 28L24 34L38 20" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="font-bold text-[18px] text-black">Review Submitted!</p>
            <p className="text-sm text-black/50">Thank you for sharing your experience.</p>
            <button
              onClick={onClose}
              className="bg-black text-white font-medium text-base px-8 py-3 rounded-full hover:opacity-80 transition-opacity"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Star picker */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-black/70">Your Rating</label>
              <StarPicker value={rating} onChange={setRating} />
            </div>

            {/* Comment */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-black/70">Your Review</label>
              <textarea
                rows={4}
                placeholder="Share your thoughts about this product..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border border-black/20 rounded-xl px-4 py-3 text-base text-black focus:outline-none focus:border-black transition-colors resize-none"
              />
            </div>

            {error && (
              <p className="text-sm text-[#FF3333] bg-[#FFF0F0] border border-[#FFB3B3] rounded-[10px] px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-black text-white font-medium text-base rounded-full py-3.5 hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              {submitting ? "Submitting…" : "Submit Review"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
