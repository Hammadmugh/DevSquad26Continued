import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#2E3D83]">
      {/* ── Main content ─────────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-[8%] pt-10 md:pt-14 pb-10 md:pb-14 grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-10 md:gap-16 lg:gap-24">
        {/* Left — logo + description */}
        <div className="flex flex-col gap-4 max-w-[408px]">
          <div className="relative w-[165px] h-[34px]">
            <Image
              src="/car-deposite.png"
              alt="Car Deposit"
              fill
              className="object-contain object-left"
            />
          </div>
          <p className="font-['Lato'] font-normal text-[16px] leading-[19px] text-[#B9B9B9]">
            Lorem ipsum dolor sit amet consectetur. Mauris eu convallis proin
            turpis pretium donec orci semper. Sit suscipit lacus cras commodo in
            lectus sed egestas. Mattis egestas sit viverra pretium tincidunt
            libero. Suspendisse aliquam donec leo nisl purus et quam pulvinar.
            Odio egestas egestas tristique et lectus viverra in sed mauris.
          </p>
        </div>

        {/* Middle — Home column */}
        <div className="flex flex-col gap-4">
          <span className="font-['Lato'] font-bold text-[20px] leading-6 text-[#E9E9E9]">
            Home
          </span>
          <Link
            href="#"
            className="font-['Lato'] font-normal text-[20px] leading-6 text-white hover:text-[#FFC300] transition-colors"
          >
            Help Center
          </Link>
          <Link
            href="#"
            className="font-['Lato'] font-normal text-[20px] leading-6 text-white hover:text-[#FFC300] transition-colors"
          >
            FAQ
          </Link>
        </div>

        {/* Right — Car Auction column */}
        <div className="flex flex-col gap-4">
          <span className="font-['Lato'] font-bold text-[20px] leading-6 text-[#E9E9E9]">
            Car Auction
          </span>
          <Link
            href="#"
            className="font-['Lato'] font-normal text-[20px] leading-6 text-white hover:text-[#FFC300] transition-colors"
          >
            Help Center
          </Link>
          <Link
            href="#"
            className="font-['Lato'] font-normal text-[20px] leading-6 text-white hover:text-[#FFC300] transition-colors"
          >
            My Account
          </Link>
        </div>
      </div>

      {/* ── Divider ──────────────────────────────────────────────── */}
      <div className="w-full h-px bg-[#656565]" />

      {/* ── Copyright bar ────────────────────────────────────────── */}
      <div className="py-5 flex items-center justify-center">
        <p
          className="font-['Lato'] font-medium text-[20px] text-white tracking-[0.015em] underline"
          style={{ lineHeight: "133%" }}
        >
          Copyright 2022{" "}
          <span className="no-underline">All Rights Reserved</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
