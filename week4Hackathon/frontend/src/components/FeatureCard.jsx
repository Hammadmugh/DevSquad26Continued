import React from "react";

const FeatureCard = ({ title, description, icon }) => {
  return (
    <div 
      className="relative bg-[#0F0F0F] border border-[#262626] rounded-xl p-6 sm:p-8 lg:p-10 flex flex-col gap-6 
      hover:border-red-600/40 hover:shadow-lg hover:shadow-red-600/10 transition duration-300"
      style={{
        background: 'linear-gradient(225deg, rgba(229, 0, 0, 0.08) 0%, transparent 50%)',
        backgroundColor: '#0F0F0F'
      }}
    >

      {/* Top */}
      <div className="flex items-center gap-4">
        
        {/* Icon */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-[#141414] border border-[#1F1F1F] rounded-xl">
          <img src={icon} alt="img" className="w-5 h-6" />
        </div>

        <h3 className="text-white text-lg sm:text-xl lg:text-2xl font-semibold">
          {title}
        </h3>
      </div>

      {/* Description */}
      <p className="text-sm sm:text-base text-[#999999] leading-relaxed">
        {description}
      </p>

    </div>
  );
};

export default FeatureCard;