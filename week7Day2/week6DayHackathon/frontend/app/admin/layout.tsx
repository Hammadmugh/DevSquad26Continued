"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user } = useAuth();

  // Redirect non-admin users
  useEffect(() => {
    if (user && user.role !== "admin" && user.role !== "superadmin") {
      router.replace("/");
    }
  }, [user, router]);

  return (
    <div
      className="flex min-h-screen"
      style={{ fontFamily: "'Rubik', 'Open Sans', sans-serif", background: "#E7E7E3" }}
    >
      <AdminSidebar />

      <div className="flex-1 ml-[260px] flex flex-col min-h-screen">
        <AdminHeader />

        {/* Page content */}
        <main className="flex-1 pt-[96px] px-6 pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}
