'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Aboutus from "@/components/Aboutus";
import LightNavbar from "@/components/LightNavbar";
import AuctionFooter from "@/components/AuctionFooter";
import { api } from "@/lib/api";

/* ── Social OAuth buttons ─────────────────────────────────── */
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

export default function RegisterPage() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!agreed) { setError("Please agree to the terms"); return; }
    if (!fullName.trim()) { setError("Full name is required"); return; }
    if (!email.trim()) { setError("Email is required"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (password !== confirmPassword) { setError("Passwords do not match"); return; }
    setError("");
    setLoading(true);
    try {
      const res = await api.auth.register({ fullName, email, password, mobile });
      localStorage.setItem("token", res.token);
      const u = res.user as { _id?: string };
      if (u._id) localStorage.setItem("userId", u._id);
      localStorage.setItem("userProfile", JSON.stringify({ fullName, email, mobile }));
      router.push("/sell-your-car");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Registration failed");
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
        {/* Heading */}
        <h1
          className="font-['Josefin_Sans'] font-semibold text-[48px] sm:text-[64px] leading-16 text-[#2E3D83] text-center"
        >
          Register
        </h1>
        {/* Blue underline */}
        <div className="w-20 h-0.75 bg-[#2E3D83] rounded-full" />

        {/* Subtitle */}
        <p className="font-['Lato'] font-medium text-[16px] sm:text-[18px] leading-5.5 text-[#545677] text-center max-w-lg px-4">
          Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus.
        </p>

        {/* Breadcrumb pill */}
        <div className="mt-2 flex items-center gap-1 bg-[#BBD0F6] rounded-t-[3px] px-4 py-2">
          <span className="font-['Lato'] font-medium text-[14px] leading-4.25 text-[#545677]">Home</span>
          <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0" fill="none">
            <path d="M6 4l4 4-4 4" stroke="#000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-['Lato'] font-medium text-[14px] leading-4.25 text-[#2E3D83]">Register</span>
        </div>
      </div>

      {/* ── Tab toggle (Register / Login) ───────────────────────── */}
      <div className="flex justify-center mt-8">
        <div className="flex rounded-full border border-black overflow-hidden w-73">
          <div className="w-40.5 bg-[#2E3D83] flex items-center justify-center rounded-full">
            <span className="font-['Lato'] font-medium text-[20px] leading-6 text-white py-3">
              Register
            </span>
          </div>
          <Link
            href="/auth/login"
            className="flex-1 flex items-center justify-center"
          >
            <span className="font-['Lato'] font-medium text-[20px] leading-6 text-[#2E3D83] py-3">
              Login
            </span>
          </Link>
        </div>
      </div>

      {/* ── Form card ───────────────────────────────────────────── */}
      <div className="flex justify-center px-4 mt-8 mb-16">
        <div className="w-full max-w-148 bg-white rounded-[5px] shadow-[0px_0px_12px_rgba(0,0,0,0.12)] px-8 py-10 flex flex-col gap-6">

          {/* Card heading */}
          <div className="flex flex-col items-center gap-1">
            <h2 className="font-['Lato'] font-bold text-[20px] leading-6 text-[#2E3D83]">Register</h2>
            <p className="font-['Lato'] font-normal text-[16px] leading-4.75 text-[#AFAFAF] text-center">
              Do you already have an account?{" "}
              <Link href="/auth/login" className="text-[#2E3D83] font-medium hover:underline">
                Login Here
              </Link>
            </p>
          </div>

          {/* ── Personal Information ── */}
          <div className="flex flex-col gap-4">
            <h3 className="font-['Lato'] font-semibold text-[16px] leading-4.75 text-[#2E3D83]">
              Personal Information
            <div className="w-18.75 h-1 bg-[#F4C23D] rounded-sm" />
            </h3>

            {/* Full Name */}
            <div className="flex flex-col gap-1">
              <label className="font-['Lato'] font-normal text-[14px] leading-4.25 text-[#2E3D83]">
                Enter Your Full Name*
              </label>
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-10 border border-[#EAECF3] rounded-[5px] px-3 font-['Lato'] text-[14px] text-[#2E3D83] outline-none focus:border-[#2E3D83] transition-colors"
              />
            </div>

            {/* Email + Mobile (two columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <div className="flex flex-col gap-1">
                <label className="font-['Lato'] font-normal text-[14px] leading-4.25 text-[#2E3D83]">
                  Enter Mobile Number*
                </label>
                <div className="flex h-10 border border-[#EAECF3] rounded-[5px] overflow-hidden focus-within:border-[#2E3D83] transition-colors">
                  <div className="flex items-center gap-1 px-2 border-r border-[#EAECF3] shrink-0">
                    <span className="font-['Lato'] font-medium text-[14px] leading-4.25 text-[#2E3D83] whitespace-nowrap">
                      India (91)
                    </span>
                    <svg viewBox="0 0 10 6" className="w-2.5 h-1.5" fill="none">
                      <path d="M1 1l4 4 4-4" stroke="#2E3D83" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <input
                    type="tel"
                    placeholder="Mobile Number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="flex-1 px-2 font-['Lato'] text-[14px] text-[#2E3D83] outline-none bg-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Account Information ── */}
          <div className="flex flex-col gap-4">
            <h3 className="font-['Lato'] font-semibold text-[16px] leading-4.75 text-[#2E3D83]">
              Account Information
            <div className="w-18.75 h-1 bg-[#F4C23D] rounded-sm" />
            </h3>

            {/* Username */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="font-['Lato'] font-normal text-[14px] leading-4.25 text-[#2E3D83]">
                  Username*
                </label>
                <button className="font-['Lato'] font-semibold text-[12px] leading-3.5 text-[#2E3D83] underline">
                  Check Availability
                </button>
              </div>
              <input
                type="text"
                placeholder="Username"
                className="w-full h-10 border border-[#EAECF3] rounded-[5px] px-3 font-['Lato'] text-[14px] text-[#2E3D83] outline-none focus:border-[#2E3D83] transition-colors"
              />
            </div>

            {/* Password + Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-['Lato'] font-normal text-[14px] leading-4.25 text-[#2E3D83]">
                  Password*
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-10 border border-[#EAECF3] rounded-[5px] px-3 font-['Lato'] text-[14px] text-[#2E3D83] outline-none focus:border-[#2E3D83] transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-['Lato'] font-normal text-[14px] leading-4.25 text-[#2E3D83]">
                  Confirm Password*
                </label>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-10 border border-[#EAECF3] rounded-[5px] px-3 font-['Lato'] text-[14px] text-[#2E3D83] outline-none focus:border-[#2E3D83] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* ── Prove You Are Human (CAPTCHA placeholder) ── */}
          <div className="flex flex-col gap-2">
            <p className="font-['Lato'] font-medium text-[16px] leading-4.75 text-[#2E3D83]">
              Prove You Are Human
            </p>
            <div className="w-full h-20 border border-[#EAECF3] rounded-[5px] flex items-center justify-center px-4 gap-4">
              {/* Checkbox */}
              <div className="w-8.75 h-8.75 border border-[#EAECF3] rounded-sm bg-white shrink-0" />
              <span className="font-['Lato'] font-semibold text-[16px] leading-4.75 text-[#2E3D83]">
                I&apos;m not a robot
              </span>
            </div>
          </div>

          {/* ── Terms checkbox ── */}
          <label className="flex items-center gap-2 cursor-pointer">
            <div
              onClick={() => setAgreed(!agreed)}
              className={`w-5 h-5 border border-[#2E3D83] rounded-sm flex items-center justify-center shrink-0 transition-colors ${
                agreed ? "bg-[#2E3D83]" : "bg-white"
              }`}
            >
              {agreed && (
                <svg viewBox="0 0 12 10" className="w-3 h-2.5" fill="none">
                  <path d="M1 5l3.5 3.5L11 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <span className="font-['Lato'] font-semibold text-[12px] leading-3.5 text-[#2E3D83]">
              I agree to the Terms &amp; Conditions
            </span>
          </label>

          {/* ── Create Account button ── */}
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          <button
            onClick={handleCreate}
            disabled={loading}
            className="w-full h-10 bg-[#2E3D83] rounded-[5px] font-['Lato'] font-bold text-[16px] leading-4.75 text-white hover:bg-[#1e2d6b] transition-colors disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          {/* ── Social login ── */}
          <div className="flex flex-col items-center gap-4">
            <p className="font-['Lato'] font-normal text-[16px] leading-4.75 text-[#2E3D83] capitalize">
              or Login with
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
