'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Aboutus from "@/components/Aboutus";
import LightNavbar from "@/components/LightNavbar";
import AuctionFooter from "@/components/AuctionFooter";
import { api } from "@/lib/api";

/* ── Social OAuth icons ───────────────────────────────────── */
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const FacebookAuthIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#5173BA" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TwitterAuthIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#1DA1F2" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
  </svg>
);

/* ── Eye icons for password toggle ───────────────────────── */
const EyeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="#C4C4C4" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="#C4C4C4" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round"/>
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await api.auth.login({ email, password });
      localStorage.setItem("token", res.token);
      const u = res.user as { _id?: string; fullName?: string; email?: string; mobile?: string };
      if (u._id) localStorage.setItem("userId", u._id);
      localStorage.setItem("userProfile", JSON.stringify({ fullName: u.fullName, email: u.email, mobile: u.mobile }));
      router.push("/sell-your-car");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      {/* ── Top bar + Navbar ─────────────────────────────────────── */}
      <Aboutus />
      <LightNavbar />

      {/* ── Light blue hero band ─────────────────────────────────── */}
      <div className="w-full bg-[#C6D8F9] pt-10 flex flex-col items-center gap-3">
        <h1 className="font-['Josefin_Sans'] font-semibold text-[48px] sm:text-[64px] leading-16 text-[#2E3D83] text-center">
          Login
        </h1>
        <div className="w-20 h-0.75 bg-[#2E3D83] rounded-full" />
        <p className="font-['Lato'] font-medium text-[16px] sm:text-[18px] leading-5.5 text-[#545677] text-center max-w-lg px-4">
          Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus.
        </p>
        {/* Breadcrumb pill */}
        <div className="mt-2 flex items-center gap-1 bg-[#BBD0F6] rounded-t-[3px] px-4 py-2">
          <span className="font-['Lato'] font-medium text-[14px] leading-4.25 text-[#545677]">Home</span>
          <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0" fill="none">
            <path d="M6 4l4 4-4 4" stroke="#000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-['Lato'] font-medium text-[14px] leading-4.25 text-[#2E3D83]">Login</span>
        </div>
      </div>

      {/* ── Tab toggle (Register / Login) ───────────────────────── */}
      <div className="flex justify-center mt-8">
        <div className="flex rounded-full border border-black overflow-hidden w-73">
          <Link
            href="/auth/register"
            className="w-40.5 flex items-center justify-center"
          >
            <span className="font-['Lato'] font-medium text-[20px] leading-6 text-[#2E3D83] py-3">
              Register
            </span>
          </Link>
          <div className="flex-1 bg-[#2E3D83] flex items-center justify-center rounded-full">
            <span className="font-['Lato'] font-medium text-[20px] leading-6 text-white py-3">
              Login
            </span>
          </div>
        </div>
      </div>

      {/* ── Form card ───────────────────────────────────────────── */}
      <div className="flex justify-center px-4 mt-8 mb-16">
        <div className="w-full max-w-148 bg-white rounded-[5px] shadow-[0px_0px_12px_rgba(0,0,0,0.12)] px-8 py-10 flex flex-col gap-6">

          {/* Card heading */}
          <div className="flex flex-col items-center gap-1">
            <h2 className="font-['Lato'] font-bold text-[20px] leading-6 text-[#2E3D83]">Log In</h2>
            <p className="font-['Lato'] font-normal text-[16px] leading-4.75 text-[#BABABA] text-center">
              New member?{" "}
              <Link href="/auth/register" className="text-[#2E3D83] font-medium hover:underline">
                Register Here
              </Link>
            </p>
          </div>

          {/* ── Email field ── */}
          <div className="flex flex-col gap-1">
            <label className="font-['Lato'] font-normal text-[14px] leading-4.25 text-[#2E3D83]">
              Enter Your Email*
            </label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 border border-[#EAECF3] rounded-[5px] px-3 font-['Lato'] text-[14px] text-[#2E3D83] outline-none focus:border-[#2E3D83] transition-colors"
            />
          </div>

          {/* ── Password field ── */}
          <div className="flex flex-col gap-1">
            <label className="font-['Lato'] font-normal text-[14px] leading-4.25 text-[#2E3D83]">
              Password*
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 border border-[#EAECF3] rounded-[5px] px-3 pr-10 font-['Lato'] text-[14px] text-[#2E3D83] outline-none focus:border-[#2E3D83] transition-colors"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {/* ── Remember me + Forgot password ── */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => setRemember(!remember)}
                className={`w-5 h-5 border border-[#2E3D83] rounded-sm flex items-center justify-center shrink-0 transition-colors ${
                  remember ? "bg-[#2E3D83]" : "bg-white"
                }`}
              >
                {remember && (
                  <svg viewBox="0 0 12 10" className="w-3 h-2.5" fill="none">
                    <path d="M1 5l3.5 3.5L11 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span className="font-['Lato'] font-semibold text-[12px] leading-3.5 text-[#2E3D83]">
                Remember me
              </span>
            </label>
            <button className="font-['Lato'] font-semibold text-[12px] leading-3.5 text-[#2E3D83] underline">
              Forget Password
            </button>
          </div>

          {/* ── Log In button ── */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full h-10 bg-[#2E3D83] rounded-[5px] font-['Lato'] font-bold text-[16px] leading-4.75 text-white hover:bg-[#1e2d6b] transition-colors disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>

          {/* ── Social login ── */}
          <div className="flex flex-col items-center gap-4">
            <p className="font-['Lato'] font-normal text-[16px] leading-4.75 text-[#2E3D83] capitalize">
              or Register with
            </p>
            <div className="flex items-center gap-5">
              {[
                { icon: <GoogleIcon />, label: "Google" },
                { icon: <FacebookAuthIcon />, label: "Facebook" },
                { icon: <TwitterAuthIcon />, label: "Twitter" },
              ].map(({ icon, label }) => (
                <button
                  key={label}
                  aria-label={`Continue with ${label}`}
                  className="w-12.5 h-12.5 rounded-full border-2 border-[#EAECF3] bg-white flex items-center justify-center hover:border-[#2E3D83] transition-colors"
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <AuctionFooter />
    </div>
  );
}
