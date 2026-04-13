"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function OAuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleOAuthCallback } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const userEncoded = searchParams.get("user");
    const isNew = searchParams.get("isNew") === "true";

    if (token && userEncoded) {
      try {
        // Decode base64url → JSON
        const json = atob(userEncoded.replace(/-/g, "+").replace(/_/g, "/"));
        const rawUser = JSON.parse(json);
        handleOAuthCallback(token, rawUser, isNew);
        router.replace(rawUser.role === "admin" ? "/admin" : "/");
      } catch {
        router.replace("/?authError=1");
      }
    } else {
      router.replace("/?authError=1");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
        <p className="text-base font-medium text-black/60">Signing you in…</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <OAuthCallbackInner />
    </Suspense>
  );
}
