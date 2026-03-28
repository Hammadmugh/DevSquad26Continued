import React from "react";
import { features } from "../../data";
import FeatureCard from "./FeatureCard";

const FeaturesSection = () => {
  return (
    <div className="lg:max-w-[1285px] md:max-w-[1279px] max-w-[358px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12 sm:gap-16 lg:gap-[60px] py-12 sm:py-16 lg:py-20">

      {/* Heading */}
      <div className="flex flex-col gap-3">
        <h2 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-[38px] font-bold">
          Why Choose Our Platform
        </h2>

        <p className="text-sm sm:text-base md:text-lg text-[#999999]">
          We provide the best streaming experience with top quality features and seamless performance.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {features.map((item, index) => (
          <FeatureCard key={index} {...item} />
        ))}
      </div>

    </div>
  );
};

export default FeaturesSection;