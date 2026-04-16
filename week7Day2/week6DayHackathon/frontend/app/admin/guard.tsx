"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminIndexRedirect() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If no user or not admin/superadmin, redirect to home
    if (user && user.role !== "admin" && user.role !== "superadmin") {
      router.replace("/");
    }
  }, [user, router]);

  // Render nothing — layout handles the dashboard page
  return null;
}
