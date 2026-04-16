'use client';

import { FaEnvelope } from "react-icons/fa";

export default function Aboutus() {
  return (
    <div style={{ padding: '8px 16px' }} className="w-full bg-[#2E3D83]">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0" style={{ paddingLeft: '40px', paddingRight: '40px' }}>
        {/* Call Us - Left */}
        <div className="flex items-center gap-2 text-white text-xs md:text-sm">
          <span className="font-medium">Call Us :</span>
          <a href="tel:570-694-4002" className="hover:text-gray-300 transition-colors">
            570-694-4002
          </a>
        </div>

        {/* Email - Right */}
        <div className="flex items-center gap-2 text-white text-xs md:text-sm">
          <FaEnvelope className="text-white text-sm flex-shrink-0" />
          <span className="font-medium">Email Id :</span>
          <a href="mailto:info@cardeposit.com" className="hover:text-gray-300 transition-colors">
            info@cardeposit.com
          </a>
        </div>
      </div>
    </div>
  );
}
