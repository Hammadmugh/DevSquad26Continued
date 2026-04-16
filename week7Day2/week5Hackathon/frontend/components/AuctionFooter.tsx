import React from "react";
import Image from "next/image";
import Link from "next/link";

/* ── Social icon SVGs ─────────────────────────────────────── */
const FacebookIcon = () => (
  <svg viewBox="0 0 26 26" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="26" height="26" rx="13" fill="#023D95" />
    <path
      d="M14.5 8.5H15.5V6.5H14C12.6 6.5 11.5 7.6 11.5 9V10.5H10V12.5H11.5V19.5H13.5V12.5H15.2L15.5 10.5H13.5V9.5C13.5 8.9 13.9 8.5 14.5 8.5Z"
      fill="white"
    />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 26 26" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="26" height="26" rx="13" fill="#023D95" />
    <rect x="6" y="6" width="14" height="14" rx="4" stroke="white" strokeWidth="1.5" />
    <circle cx="13" cy="13" r="3.5" stroke="white" strokeWidth="1.5" />
    <circle cx="17" cy="9" r="1" fill="white" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 26 26" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="26" height="26" rx="13" fill="#023D95" />
    <path d="M8 11H10V18H8V11Z" fill="white" />
    <circle cx="9" cy="9" r="1.2" fill="white" />
    <path d="M12 11H14V12C14.5 11.3 15.3 11 16 11C17.7 11 18 12.1 18 13.5V18H16V14C16 13.2 15.7 12.5 14.8 12.5C14 12.5 14 13.3 14 14V18H12V11Z" fill="white" />
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 26 26" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="26" height="26" rx="13" fill="#023D95" />
    <path
      d="M19 8.5C18.4 8.8 17.8 9 17.1 9.1C17.8 8.7 18.3 8 18.5 7.2C17.9 7.6 17.2 7.9 16.4 8C15.8 7.4 15 7 14 7C12.2 7 10.8 8.4 10.8 10.2C10.8 10.5 10.8 10.7 10.9 10.9C8.2 10.8 5.8 9.5 4.2 7.6C3.9 8.1 3.7 8.7 3.7 9.4C3.7 10.6 4.3 11.7 5.2 12.3C4.7 12.3 4.2 12.2 3.8 11.9V12C3.8 13.6 4.9 14.9 6.4 15.2C6.1 15.3 5.8 15.3 5.4 15.3C5.2 15.3 5 15.3 4.8 15.2C5.2 16.6 6.5 17.6 8 17.6C6.9 18.4 5.5 18.9 4 18.9C3.7 18.9 3.4 18.9 3 18.8C4.5 19.7 6.3 20.2 8.2 20.2C14 20.2 17.2 15.4 17.2 11.2V10.8C17.8 10.4 18.5 9.7 19 8.9V8.5Z"
      fill="white"
    />
  </svg>
);

/* ── Contact icon SVGs ────────────────────────────────────── */
const PhoneIcon = () => (
  <svg viewBox="0 0 20 20" className="w-5 h-5 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.4 2H4C2.9 2 2 2.9 2 4C2 12.8 9.2 20 18 20C19.1 20 20 19.1 20 18V15.6C20 15 19.6 14.5 19.1 14.3L15.7 13.1C15.1 12.9 14.5 13.1 14.1 13.5L12.9 14.7C10.9 13.6 9.4 12.1 8.3 10.1L9.5 8.9C9.9 8.5 10.1 7.9 9.9 7.3L8.7 3.9C8.5 3.4 8 3 7.4 3L6.4 2Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const EmailIcon = () => (
  <svg viewBox="0 0 20 16" className="w-5 h-4 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="18" height="14" rx="2" stroke="white" strokeWidth="1.5" />
    <path d="M1 4L10 9L19 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const LocationIcon = () => (
  <svg viewBox="0 0 16 20" className="w-4 h-5 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 1C4.7 1 2 3.7 2 7C2 11.5 8 19 8 19C8 19 14 11.5 14 7C14 3.7 11.3 1 8 1Z" stroke="white" strokeWidth="1.5" />
    <circle cx="8" cy="7" r="2" stroke="white" strokeWidth="1.5" />
  </svg>
);

/* ── Nav link helper ──────────────────────────────────────── */
const NavLink = ({ href = "#", children }: { href?: string; children: React.ReactNode }) => (
  <Link
    href={href}
    className="font-['Lato'] font-normal text-[20px] leading-6 text-white hover:text-[#FFC300] transition-colors"
  >
    {children}
  </Link>
);

/* ── Main component ──────────────────────────────────────── */
const AuctionFooter: React.FC = () => {
  return (
    <footer className="w-full bg-[#2E3D83]">
      {/* ── Main grid ──────────────────────────────────────────────── */}
      <div className="max-w-360 mx-auto px-[8%] pt-10 md:pt-14 pb-10 md:pb-14 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-[1fr_auto_auto_auto] gap-10 md:gap-12 lg:gap-16">

        {/* Col 1 — Logo + description + Follow Us */}
        <div className="flex flex-col gap-5 max-w-102">
          <div className="relative w-41.25 h-10.5">
            <Image
              src="/car-deposite.png"
              alt="Car Deposit"
              fill
              className="object-contain object-left"
            />
          </div>

          <p className="font-['Lato'] font-normal text-[16px] leading-4.75 text-[#B9B9B9]">
            Lorem ipsum dolor sit amet consectetur. Mauris eu convallis proin
            turpis pretium donec orci semper. Sit suscipit lacus cras commodo in
            lectus sed egestas. Mattis egestas sit viverra pretium tincidunt
            libero. Suspendisse aliquam donec leo nisl purus et quam pulvinar.
            Odio egestas egestas tristique et lectus viverra in sed mauris.
          </p>

          {/* Follow Us */}
          <div className="flex flex-col gap-3 mt-2">
            <div>
              <span
                className="font-['Lato'] font-bold text-[20px] text-white tracking-[0.015em]"
                style={{ lineHeight: "133%" }}
              >
                Follow Us
              </span>
              <div className="mt-1 w-13 h-0.75 bg-white rounded-sm" />
            </div>
            <div className="flex items-center gap-4 mt-2">
              <div className="w-6.5 h-6.5"><FacebookIcon /></div>
              <div className="w-6.5 h-6.5"><InstagramIcon /></div>
              <div className="w-6.5 h-6.5"><LinkedInIcon /></div>
              <div className="w-6.5 h-6.5"><TwitterIcon /></div>
            </div>
          </div>
        </div>

        {/* Col 2 — Home */}
        <div className="flex flex-col gap-11">
          <span className="font-['Lato'] font-bold text-[20px] leading-6 text-[#E9E9E9]">
            Home
          </span>
          <NavLink>Help Center</NavLink>
          <NavLink>FAQ</NavLink>
          <NavLink>My Account</NavLink>
          <NavLink>My Account</NavLink>
        </div>

        {/* Col 3 — Car Auction */}
        <div className="flex flex-col gap-11">
          <span className="font-['Lato'] font-bold text-[20px] leading-6 text-[#E9E9E9]">
            Car Auction
          </span>
          <NavLink>Help Center</NavLink>
          <NavLink>FAQ</NavLink>
          <NavLink>My Account</NavLink>
          <NavLink>My Account</NavLink>
        </div>

        {/* Col 4 — About Us with timeline */}
        <div className="flex flex-col gap-5">
          <span className="font-['Lato'] font-bold text-[20px] leading-6 text-[#E9E9E9]">
            About us
          </span>

          {/* Timeline */}
          <div className="flex gap-4">
            {/* Vertical track — dots + lines */}
            <div className="flex flex-col items-center">
              {/* dot 1 */}
              <div className="w-4.25 h-4.25 rounded-full bg-white shrink-0" />
              {/* line 1 */}
              <div className="w-0.75 flex-1 min-h-15.5 bg-white" />
              {/* dot 2 */}
              <div className="w-4.25 h-4.25 rounded-full bg-white shrink-0" />
              {/* line 2 */}
              <div className="w-0.75 flex-1 min-h-16.75 bg-white" />
              {/* dot 3 */}
              <div className="w-4.25 h-4.25 rounded-full bg-white shrink-0" />
            </div>

            {/* Text items */}
            <div className="flex flex-col justify-between py-0.5">
              {/* Phone */}
              <div className="flex items-start gap-2">
                <PhoneIcon />
                <div className="flex flex-col">
                  <span className="font-['Lato'] font-normal text-[14px] leading-4.25 text-white">
                    Hot Line Number
                  </span>
                  <span className="font-['Lato'] font-semibold text-[14px] leading-4.25 text-white">
                    +054 211 4444
                  </span>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-2 my-6">
                <EmailIcon />
                <div className="flex flex-col">
                  <span className="font-['Lato'] font-medium text-[16px] leading-4.75 text-white">
                    Email Id :
                  </span>
                  <span className="font-['Lato'] font-medium text-[16px] leading-4.75 text-white underline">
                    info@cardeposit.com
                  </span>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-2">
                <LocationIcon />
                <p className="font-['Lato'] font-normal text-[12px] leading-3.5 text-white max-w-44">
                  Office No 6, SKB Plaza next to Bentley showroom, Umm Al Sheif
                  Street, Sheikh Zayed Road, Dubai, UAE
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Divider ──────────────────────────────────────────────── */}
      <div className="w-full h-px bg-[#656565]" />

      {/* ── Copyright bar ────────────────────────────────────────── */}
      <div className="py-5 flex items-center justify-center">
        <p
          className="font-['Lato'] font-medium text-[20px] text-white tracking-[0.015em] underline text-center"
          style={{ lineHeight: "133%" }}
        >
          Copyright 2022{" "}
          <span className="no-underline">All Rights Reserved</span>
        </p>
      </div>
    </footer>
  );
};

export default AuctionFooter;
