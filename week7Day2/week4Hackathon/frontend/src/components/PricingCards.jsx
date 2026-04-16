import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cards } from "../../data";
import { authService } from "../services/authService";

const PricingCards = () => {
  const [activeTab, setActiveTab] = useState("monthly");
  const navigate = useNavigate();

  // Map card ID to plan ID for navigation
  const planMapping = {
    1: 'basic',
    2: 'standard',
    3: 'premium'
  };

  const handleChoosePlan = (cardId) => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      // Redirect to login
      navigate('/login');
      return;
    }

    // User is authenticated, navigate to payment page
    const planId = planMapping[cardId];
    navigate(`/payment/${planId}`);
  };

  return (
    <div className="lg:max-w-[1280px] md:max-w-[1024px] max-w-[358px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12 sm:gap-16 lg:gap-[60px] py-12 sm:py-16 lg:py-20">
      
      {/* Header Container */}
      <div className="flex flex-col lg:flex-row lg:items-end gap-6 lg:gap-20 w-full">
        
        {/* Text Container */}
        <div className="flex flex-col gap-2 sm:gap-3 lg:gap-[10px] flex-1">
          <h2 className="text-white text-2xl sm:text-3xl lg:text-[28px] font-bold font-manrope">
            Choose the plan that's right for you
          </h2>
          <p className="text-[#999999] text-sm sm:text-base lg:text-[16px] font-manrope">
            Join StreamVibe and select from our flexible subscription options tailored to suit your viewing preferences. Get ready for non-stop entertainment!
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 w-fit bg-[#0F0F0F] border border-[#262626] rounded-lg p-2">
          {["monthly", "yearly"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 rounded-[6px] font-manrope font-semibold text-sm transition ${
                activeTab === tab
                  ? "bg-[#1F1F1F] text-white"
                  : "text-[#999999] hover:text-white"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-5 w-full">
        {cards.map((card) => (
          <div
            key={card.id}
            className="flex flex-col gap-10 p-6 sm:p-10 lg:p-10 bg-[#1A1A1A] border border-[#262626] rounded-lg lg:rounded-[10px]"
          >
            {/* Text Container */}
            <div className="flex flex-col gap-3 lg:gap-3">
              <h3 className="font-manrope font-bold text-white text-lg sm:text-xl lg:text-[20px] leading-[150%]">
                {card.title}
              </h3>
              <p className="text-[#999999] text-sm sm:text-base lg:text-[16px] leading-[150%]">
                {card.description}
              </p>
            </div>

            {/* Price Container */}
            <div className="flex items-end gap-0.5">
              <span className="font-manrope font-bold text-white text-[30px] leading-[73%]">
                {card.number}
              </span>
              <span className="text-[#999999] font-manrope font-medium text-sm leading-[73%]">
                {card.unit}
              </span>
            </div>

            {/* Buttons Container */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              {card.buttons.map((button, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (button.variant === 'red') {
                      handleChoosePlan(card.id);
                    }
                  }}
                  className={`flex-1 px-5 py-3 lg:px-5 lg:py-3 font-manrope font-semibold text-sm lg:text-[14px] rounded-lg transition ${
                    button.variant === "dark"
                      ? "bg-[#141414] border border-[#262626] text-white hover:bg-[#262626]"
                      : "bg-[#E60000] text-white hover:bg-red-700"
                  }`}
                >
                  {button.text}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default PricingCards;
