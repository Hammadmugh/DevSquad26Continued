"use client";

import { useState } from "react";
import Link from "next/link";

const footerLinks = [
  {
    heading: "Company",
    links: ["About", "Features", "Works", "Career"],
  },
  {
    heading: "Help",
    links: ["Customer Support", "Delivery Details", "Terms & Conditions", "Privacy Policy"],
  },
  {
    heading: "FAQ",
    links: ["Account", "Manage Deliveries", "Orders", "Payments"],
  },
  {
    heading: "Resources",
    links: ["Free eBooks", "Development Tutorial", "How to - Blog", "Youtube Playlist"],
  },
];

function TwitterIcon() {
  return (
    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.72 0H12L7.76 4.82L12.8 10H8.8L5.68 6.52L2.12 10H0.84L5.36 4.84L0.48 0H4.56L7.4 3.16L10.72 0ZM10.28 8.98H10.98L3.06 0.72H2.3L10.28 8.98Z" fill="black"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.25 4.67V3.17C5.25 2.53 5.71 2.42 6.02 2.42H7.75V0H5.26C2.5 0 1.88 2.06 1.88 3.38V4.67H0V7.17H1.88V14H5.25V7.17H7.56L7.69 5.92L7.81 4.67H5.25Z" fill="white"/>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 1.26C8.87 1.26 9.09 1.27 9.83 1.3C11.47 1.38 12.23 2.15 12.31 3.78C12.34 4.52 12.35 4.74 12.35 6.61C12.35 8.48 12.34 8.7 12.31 9.44C12.23 11.07 11.47 11.84 9.83 11.92C9.09 11.95 8.87 11.96 7 11.96C5.13 11.96 4.91 11.95 4.17 11.92C2.53 11.84 1.77 11.07 1.69 9.44C1.66 8.7 1.65 8.48 1.65 6.61C1.65 4.74 1.66 4.52 1.69 3.78C1.77 2.15 2.53 1.38 4.17 1.3C4.91 1.27 5.13 1.26 7 1.26ZM7 0C5.1 0 4.86 0.01 4.11 0.04C1.97 0.14 0.74 1.37 0.64 3.51C0.61 4.26 0.6 4.5 0.6 6.61C0.6 8.72 0.61 8.96 0.64 9.71C0.74 11.85 1.97 13.08 4.11 13.18C4.86 13.21 5.1 13.22 7 13.22C8.9 13.22 9.14 13.21 9.89 13.18C12.03 13.08 13.26 11.85 13.36 9.71C13.39 8.96 13.4 8.72 13.4 6.61C13.4 4.5 13.39 4.26 13.36 3.51C13.26 1.37 12.03 0.14 9.89 0.04C9.14 0.01 8.9 0 7 0ZM7 3.22C5.01 3.22 3.4 4.83 3.4 6.61C3.4 8.39 5.01 10 7 10C8.99 10 10.6 8.39 10.6 6.61C10.6 4.83 8.99 3.22 7 3.22ZM7 8.74C5.71 8.74 4.66 7.69 4.66 6.61C4.66 5.53 5.71 4.48 7 4.48C8.29 4.48 9.34 5.53 9.34 6.61C9.34 7.69 8.29 8.74 7 8.74ZM10.74 2.3C10.28 2.3 9.9 2.68 9.9 3.14C9.9 3.6 10.28 3.97 10.74 3.97C11.2 3.97 11.58 3.6 11.58 3.14C11.58 2.68 11.2 2.3 10.74 2.3Z" fill="black"/>
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M7 0C3.13 0 0 3.13 0 7C0 10.1 2.01 12.72 4.79 13.64C5.14 13.7 5.27 13.49 5.27 13.31V12.04C3.31 12.46 2.9 11.1 2.9 11.1C2.58 10.3 2.12 10.09 2.12 10.09C1.49 9.66 2.17 9.67 2.17 9.67C2.87 9.72 3.24 10.39 3.24 10.39C3.86 11.45 4.88 11.14 5.3 10.97C5.36 10.52 5.54 10.21 5.74 10.04C4.16 9.86 2.5 9.25 2.5 6.59C2.5 5.83 2.77 5.2 3.25 4.71C3.18 4.54 2.94 3.82 3.32 2.86C3.32 2.86 3.91 2.68 5.27 3.58C5.84 3.42 6.42 3.34 7 3.34C7.58 3.34 8.16 3.42 8.73 3.58C10.09 2.68 10.68 2.86 10.68 2.86C11.06 3.82 10.82 4.54 10.75 4.71C11.23 5.2 11.5 5.83 11.5 6.59C11.5 9.26 9.83 9.86 8.25 10.03C8.5 10.24 8.73 10.65 8.73 11.28V13.31C8.73 13.49 8.86 13.71 9.21 13.64C11.99 12.72 14 10.1 14 7C14 3.13 10.87 0 7 0Z" fill="black"/>
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="rgba(0,0,0,0.4)"/>
    </svg>
  );
}

const socialLinks = [
  { icon: <TwitterIcon />, href: "#", bg: "bg-white border border-black/20", label: "Twitter" },
  { icon: <FacebookIcon />, href: "#", bg: "bg-black", label: "Facebook" },
  { icon: <InstagramIcon />, href: "#", bg: "bg-white border border-black/20", label: "Instagram" },
  { icon: <GithubIcon />, href: "#", bg: "bg-white border border-black/20", label: "GitHub" },
];

const paymentIcons = [
  { label: "Visa", src: "https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" },
  { label: "Mastercard", src: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" },
  { label: "PayPal", src: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" },
  { label: "Apple Pay", src: "https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" },
  { label: "Google Pay", src: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" },
];

export default function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer className="w-full bg-[#F0F0F0]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-[100px]">

        {/* Newsletter banner */}
        <div className="-translate-y-0 pt-12 md:pt-16">
          <div className="bg-black rounded-[20px] px-8 md:px-16 py-10 md:py-11 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <h2
              className="text-white font-extrabold text-[28px] md:text-[40px] leading-[1.12] uppercase max-w-[551px]"
              style={{ fontFamily: "'Integral CF', sans-serif" }}
            >
              Stay Upto Date About Our Latest Offers
            </h2>

            <div className="flex flex-col gap-3.5 w-full md:w-[349px] shrink-0">
              {/* Email input */}
              <div className="flex items-center gap-3 bg-white rounded-[62px] px-4 py-3">
                <EmailIcon />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-base text-black placeholder:text-black/40"
                  style={{ fontFamily: "'Satoshi', sans-serif" }}
                />
              </div>
              {/* Subscribe button */}
              <button
                className="w-full bg-white text-black font-medium text-base leading-[22px] rounded-[62px] py-3 hover:bg-gray-100 transition-colors"
                style={{ fontFamily: "'Satoshi', sans-serif" }}
              >
                Subscribe to Newsletter
              </button>
            </div>
          </div>
        </div>

        {/* Main footer content */}
        <div className="pt-10 pb-6 md:pt-14 md:pb-8">
          <div className="flex flex-col md:flex-row gap-10 md:gap-0 md:justify-between">

            {/* Brand column */}
            <div className="flex flex-col gap-8 md:max-w-[248px]">
              <div className="flex flex-col gap-6">
                <Link
                  href="/"
                  className="text-black font-extrabold text-[28px] md:text-[34px] leading-none tracking-tight"
                  style={{ fontFamily: "'Integral CF', sans-serif" }}
                >
                  SHOP.CO
                </Link>
                <p
                  className="text-black/60 text-sm leading-[22px]"
                  style={{ fontFamily: "'Satoshi', sans-serif" }}
                >
                  We have clothes that suits your style and which you're proud to wear. From women to men.
                </p>
              </div>

              {/* Social icons */}
              <div className="flex items-center gap-3">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className={`w-7 h-7 rounded-full flex items-center justify-center hover:opacity-70 transition-opacity ${s.bg}`}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            <div className="grid grid-cols-2 md:flex md:flex-row gap-8 md:gap-16">
              {footerLinks.map((col) => (
                <div key={col.heading} className="flex flex-col gap-6">
                  <h3
                    className="text-black font-medium text-sm md:text-base tracking-[3px] uppercase"
                    style={{ fontFamily: "'Satoshi', sans-serif" }}
                  >
                    {col.heading}
                  </h3>
                  <ul className="flex flex-col gap-4">
                    {col.links.map((link) => (
                      <li key={link}>
                        <Link
                          href="#"
                          className="text-black/60 text-sm md:text-base leading-[19px] hover:text-black transition-colors whitespace-nowrap"
                          style={{ fontFamily: "'Satoshi', sans-serif" }}
                        >
                          {link}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-black/10" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-6">
          <p
            className="text-black/60 text-sm leading-[19px]"
            style={{ fontFamily: "'Satoshi', sans-serif" }}
          >
            Shop.co © 2000-2023, All Rights Reserved
          </p>

          {/* Payment badges */}
          <div className="flex items-center gap-3">
            {paymentIcons.map((p) => (
              <div
                key={p.label}
                className="h-[30px] px-2 bg-white border border-[#D6DCE5] rounded-[5px] shadow-sm flex items-center justify-center"
                style={{ minWidth: "46px" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.src}
                  alt={p.label}
                  className="h-[14px] w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
