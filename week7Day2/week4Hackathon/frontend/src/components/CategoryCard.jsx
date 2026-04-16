import React from "react";

const CategoryCard = ({ title, images, showTag = false }) => {
  return (
    <div className="bg-[#1A1A1A] border border-[#262626] rounded-xl p-6 flex flex-col gap-4 hover:scale-105 transition duration-300 cursor-pointer">
      
      {/* Images Grid */}
      <div className="grid grid-cols-2 gap-1 relative">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt=""
            className="h-28 w-full object-cover rounded-lg"
          />
        ))}

        {/* Gradient overlay */}
        <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-[#1A1A1A] to-transparent rounded-lg"></div>

        {/* Top 10 Tag - Positioned just above title */}
        {showTag && (
          <div className="absolute bottom-0 left-0 inline-flex items-center px-3 py-1 bg-[#E60000] rounded-sm cursor-default z-10">
            <span className="text-white text-xs font-semibold">Top 10 in</span>
          </div>
        )}
      </div>

      {/* Title */}
      <div className="flex justify-between items-center">
        <h3 className="text-white text-[18px] font-semibold">
          {title}
        </h3>
        <span className="text-white text-xl"><img src="/right arrow.png" alt="left" className="w-6 h-6"/></span>
      </div>
    </div>
  );
};

export default CategoryCard;