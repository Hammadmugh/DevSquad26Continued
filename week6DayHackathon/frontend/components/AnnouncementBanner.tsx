"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AnnouncementBanner() {
  const [visible, setVisible] = useState(true);
  const { openAuthModal } = useAuth();

  if (!visible) return null;

  return (
    <div className="w-full bg-black py-2 px-4 flex items-center justify-center relative min-h-[38px]">
      <p className="text-white text-sm font-normal text-center leading-[19px]">
        Sign up and get 20% off to your first order.{" "}
        <button
          onClick={() => openAuthModal("register")}
          className="underline font-medium cursor-pointer hover:opacity-80 transition-opacity"
        >
          Sign Up Now
        </button>
      </p>
      <button
        onClick={() => setVisible(false)}
        aria-label="Close announcement"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white w-5 h-5 flex items-center justify-center hover:opacity-70 transition-opacity md:block hidden"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M1 1L13 13M13 1L1 13"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
