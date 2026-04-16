import React from "react";

const Footer = () => {
  const footerColumns = [
    {
      title: "Home",
      links: ["Categories", "Devices", "Pricing", "FAQ"]
    },
    {
      title: "Movies",
      links: ["Genres", "Trending", "New Releases", "Popular"]
    },
    {
      title: "Shows",
      links: ["Genres", "Trending", "New Episodes", "Popular"]
    },
    {
      title: "Support",
      links: ["Contact Us"]
    },
    {
      title: "Subscription",
      links: ["Plans", "FAQ", "Manage Account"]
    },
    {
      title: "Connect With Us",
      hasSocial: true
    }
  ];

  return (
    <footer className="w-full bg-[#0F0F0F] border-t border-[#262626]">
      <div className="lg:max-w-[1440px] md:max-w-[1024px] max-w-[358px] w-full mx-auto px-4 sm:px-6 lg:px-20 py-16 sm:py-20 lg:pb-10">
        
        {/* Main Footer Container */}
        <div className="flex flex-col gap-12 lg:gap-10">
          
          {/* Links Container */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-5 w-full">
            {footerColumns.map((column, idx) => (
              <div key={idx} className="flex flex-col gap-5">
                {/* Heading */}
                <h3 className="text-white font-manrope font-semibold text-sm lg:text-base">
                  {column.title}
                </h3>

                {/* Links Container */}
                {column.links && (
                  <div className="flex flex-col gap-2.5 lg:gap-2.5">
                    {column.links.map((link, linkIdx) => (
                      <a
                        key={linkIdx}
                        href="#"
                        className="text-[#999999] font-manrope font-medium text-sm lg:text-base hover:text-white transition"
                      >
                        {link}
                      </a>
                    ))}
                  </div>
                )}

                {/* Social Icons */}
                {column.hasSocial && (
                  <div className="flex gap-2.5">
                    <button className="w-11 h-11 bg-[#1A1A1A] border border-[#262626] rounded-lg flex items-center justify-center hover:bg-[#262626] transition">
                      <img src="/facebook.png" alt="facebook" className="w-[20px] h-[20px]"/>
                    </button>
                    <button className="w-11 h-11 bg-[#1A1A1A] border border-[#262626] rounded-lg flex items-center justify-center hover:bg-[#262626] transition">
                      <img src="/twitter.png" alt="twitter" className="w-[20px] h-[20px]"/>
                    </button>
                    <button className="w-11 h-11 bg-[#1A1A1A] border border-[#262626] rounded-lg flex items-center justify-center hover:bg-[#262626] transition">
                       <img src="/linkedin.png" alt="linkedin" className="w-[20px] h-[20px]"/>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-[#262626]" />

          {/* Bottom Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            {/* Copyright Text */}
            <p className="text-[#999999] font-manrope text-xs lg:text-sm">
              © 2024 StreamVibe. All rights reserved.
            </p>

            {/* Policy Links */}
            <div className="flex flex-wrap gap-6 lg:gap-6">
              <a href="#" className="text-[#999999] font-manrope text-xs lg:text-sm hover:text-white transition">
                Privacy Policy
              </a>
              <div className="w-px h-5 bg-[#262626]" />
              <a href="#" className="text-[#999999] font-manrope text-xs lg:text-sm hover:text-white transition">
                Terms of Service
              </a>
              <div className="w-px h-5 bg-[#262626]" />
              <a href="#" className="text-[#999999] font-manrope text-xs lg:text-sm hover:text-white transition">
                Cookie Settings
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
