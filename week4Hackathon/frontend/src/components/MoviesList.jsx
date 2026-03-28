import React from 'react';

const MoviesList = ({ children, buttonLabel = "Movies" }) => {
  return (
    <>
      {/* Mobile View - Show children without MoviesList styling */}
      <div className="md:hidden w-full px-1 py-16">
        <div className="flex flex-col gap-6">
          {children}
        </div>
      </div>

      {/* Desktop View - Show with MoviesList styling */}
      <div className="hidden md:block w-full max-w-7xl mx-auto px-1 md:px-10 lg:px-20 py-16">
        {/* Container with Border and Overlay Button */}
        <div className="relative">
          {/* Button Tag - Positioned over border */}
          <div className="absolute top-0 left-8 z-10 transform -translate-y-1/2">
            <button className="bg-[#E60000] text-white px-6 py-2 rounded-lg font-semibold text-sm hover:bg-[#CC0000] transition cursor-default pointer-events-none">
              {buttonLabel}
            </button>
          </div>

          {/* Container with Border */}
          <div className="border border-neutral-800 rounded-2xl p-8 bg-neutral-900/50 backdrop-blur-sm">

            {/* Content Area - Ready for your components */}
            <div className="flex flex-col gap-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MoviesList;
