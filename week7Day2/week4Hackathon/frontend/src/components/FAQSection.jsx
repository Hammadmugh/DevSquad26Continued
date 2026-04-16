import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { faqItems } from "../../data";

const FAQSection = () => {
  const [openItems, setOpenItems] = useState({ 0: true });

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const leftItems = faqItems.slice(0, 4);
  const rightItems = faqItems.slice(4, 8);

  return (
    <div className="lg:max-w-[1597px] md:max-w-[1279px] max-w-[358px] w-full mx-auto px-4 sm:px-6 lg:px-17 flex flex-col gap-12 sm:gap-16 lg:gap-[60px] py-12 sm:py-16 lg:py-20">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-8 lg:gap-20 w-full">
        
        {/* Text Container */}
        <div className="flex flex-col gap-2 sm:gap-3 lg:gap-[10px] flex-1">
          <h2 className="text-white text-2xl sm:text-3xl lg:text-[28px] font-bold font-manrope">
            Frequently Asked Questions
          </h2>
          <p className="text-[#999999] text-sm sm:text-base lg:text-[16px] font-manrope">
            Find answers to common questions about our platform
          </p>
        </div>

        {/* Button */}
        <button className="flex items-center justify-center px-5 sm:px-6 py-3 sm:py-4 lg:px-5 lg:py-3 bg-[#E60000] hover:bg-red-700 text-white font-manrope font-semibold text-sm sm:text-base lg:text-[14px] rounded-lg lg:rounded-[6px] transition w-fit flex-shrink-0">
          Ask Question
        </button>
      </div>

      {/* FAQ Items Container */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 w-full">
        
        {/* Left Column */}
        <div className="flex flex-col gap-6 lg:gap-0 flex-1">
          {leftItems.map((item, idx) => (
            <div key={item.id}>
              <div 
                onClick={() => toggleItem(idx)}
                className="flex items-start lg:items-center gap-4 p-4 sm:p-6 lg:p-6 lg:pl-0 cursor-pointer hover:bg-[#1A1A1A] transition rounded-lg lg:rounded-none"
              >
                {/* Number Box */}
                <div className="flex-shrink-0 flex items-center justify-center w-12 sm:w-14 lg:w-[50px] h-12 sm:h-14 lg:h-[54px] bg-[#1F1F1F] border border-[#262626] rounded-[8px]">
                  <span className="font-manrope font-semibold text-white text-base lg:text-[16px]">
                    {item.id}
                  </span>
                </div>

                {/* Text & Icon */}
                <div className="flex-1 flex items-center justify-between gap-3">
                  <div className="flex flex-col gap-2 lg:gap-[14px] min-w-0">
                    <h3 className="font-manrope font-semibold text-white text-base sm:text-lg lg:text-[20px] leading-[150%]">
                      {item.question}
                    </h3>
                    {openItems[idx] && (
                      <p className="text-[#999999] text-sm sm:text-base lg:text-[16px] leading-[150%]">
                        {item.answer}
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    {openItems[idx] ? (
                      <Minus size={24} className="text-white" />
                    ) : (
                      <Plus size={24} className="text-white" />
                    )}
                  </div>
                </div>
              </div>
              {idx < leftItems.length - 1 && (
                <div 
                  className="hidden lg:block"
                  style={{
                    height: '1px',
                    border: 'none',
                    borderTop: '1px solid',
                    borderImage: 'linear-gradient(90deg, rgba(229, 0, 0, 0) 0%, #E50000 16.67%, rgba(229, 0, 0, 0) 100%) 1'
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6 lg:gap-0 flex-1">
          {rightItems.map((item, idx) => (
            <div key={item.id}>
              <div 
                onClick={() => toggleItem(idx + 3)}
                className="flex items-start lg:items-center gap-4 p-4 sm:p-6 lg:p-6 cursor-pointer hover:bg-[#1A1A1A] transition rounded-lg lg:rounded-none"
              >
                {/* Number Box */}
                <div className="flex-shrink-0 flex items-center justify-center w-12 sm:w-14 lg:w-[52px] h-12 sm:h-14 lg:h-[54px] bg-[#1F1F1F] border border-[#262626] rounded-[8px]">
                  <span className="font-manrope font-semibold text-white text-base lg:text-[16px]">
                    {item.id}
                  </span>
                </div>

                {/* Text & Icon */}
                <div className="flex-1 flex items-center justify-between gap-3">
                  <div className="flex flex-col gap-2 lg:gap-[14px] min-w-0">
                    <h3 className="font-manrope font-semibold text-white text-base sm:text-lg lg:text-[20px] leading-[150%]">
                      {item.question}
                    </h3>
                    {openItems[idx + 3] && (
                      <p className="text-[#999999] text-sm sm:text-base lg:text-[16px] leading-[150%]">
                        {item.answer}
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    {openItems[idx + 3] ? (
                      <Minus size={24} className="text-white" />
                    ) : (
                      <Plus size={24} className="text-white" />
                    )}
                  </div>
                </div>
              </div>
              {idx < rightItems.length - 1 && (
                <div 
                  className="hidden lg:block"
                  style={{
                    height: '1px',
                    border: 'none',
                    borderTop: '1px solid',
                    borderImage: 'linear-gradient(90deg, rgba(229, 0, 0, 0) 0%, #E50000 16.67%, rgba(229, 0, 0, 0) 100%) 1'
                  }}
                />
              )}
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};

export default FAQSection;
