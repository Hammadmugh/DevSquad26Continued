'use client';

import React, { useState } from 'react';

export interface FilterValues {
  type?: string;
  color?: string;
  make?: string;
  model?: string;
  style?: string;
  minPrice?: string;
  maxPrice?: string;
}

interface FilterCardProps {
  onFilter?: (filters: FilterValues) => void;
}

const FilterCard: React.FC<FilterCardProps> = ({ onFilter }) => {
  const [carType, setCarType] = useState('');
  const [color, setColor] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [style, setStyle] = useState('');
  const [priceRange, setPriceRange] = useState(50);

  const selectClass =
    'w-full h-10 bg-transparent border border-[#828BB5] rounded-sm px-3 ' +
    "font-['Lato'] font-medium text-sm text-[#BABABA] appearance-none cursor-pointer " +
    'focus:outline-none';

  const minPrice = 0;
  const maxPrice = 100000;
  const currentPrice = Math.round((priceRange / 100) * maxPrice);

  return (
    <div className="w-72 rounded-md overflow-visible bg-[#2E3D83]">
      {/* Header */}
      <div className="flex items-center gap-3 h-[50px] bg-[#4658AC] rounded-t-md px-4">
        <div className="w-0.5 h-8 bg-[#FDB94B]" />
        <span className="font-['Lato'] font-medium text-base text-white">Filter By</span>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-4 px-4 pt-5 pb-6">
        {/* Any Car Type */}
        <div className="relative">
          <select
            value={carType}
            onChange={(e) => setCarType(e.target.value)}
            className={selectClass}
          >
            <option value="" disabled hidden>Any Car Type</option>
            <option value="sedan">Sedan</option>
            <option value="suv">SUV</option>
            <option value="hatchback">Hatchback</option>
            <option value="coupe">Coupe</option>
            <option value="pickup">Pickup</option>
          </select>
          <svg className="pointer-events-none absolute right-3 top-3 w-3 h-3 fill-[#828BB5]" viewBox="0 0 10 6">
            <path d="M0 0l5 6 5-6z" />
          </svg>
        </div>

        {/* Any Color */}
        <div className="relative">
          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className={selectClass.replace('#828BB5', '#828BB5')}
          >
            <option value="" disabled hidden>Any Color</option>
            <option value="white">White</option>
            <option value="black">Black</option>
            <option value="red">Red</option>
            <option value="blue">Blue</option>
            <option value="silver">Silver</option>
          </select>
          <svg className="pointer-events-none absolute right-3 top-3 w-3 h-3 fill-[#828BB5]" viewBox="0 0 10 6">
            <path d="M0 0l5 6 5-6z" />
          </svg>
        </div>

        {/* Any Makes */}
        <div className="relative">
          <select
            value={make}
            onChange={(e) => setMake(e.target.value)}
            className={selectClass.replace('border-[#828BB5]', 'border-[#BABABA]')}
          >
            <option value="" disabled hidden>Any Makes</option>
            <option value="toyota">Toyota</option>
            <option value="honda">Honda</option>
            <option value="bmw">BMW</option>
            <option value="mercedes">Mercedes</option>
            <option value="ford">Ford</option>
          </select>
          <svg className="pointer-events-none absolute right-3 top-3 w-3 h-3 fill-[#BABABA]" viewBox="0 0 10 6">
            <path d="M0 0l5 6 5-6z" />
          </svg>
        </div>

        {/* Any Car Model */}
        <div className="relative">
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className={selectClass.replace('border-[#828BB5]', 'border-[#BABABA]')}
          >
            <option value="" disabled hidden>Any Car Model</option>
            <option value="2020">2020</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
          </select>
          <svg className="pointer-events-none absolute right-3 top-3 w-3 h-3 fill-[#BABABA]" viewBox="0 0 10 6">
            <path d="M0 0l5 6 5-6z" />
          </svg>
        </div>

        {/* Any Style */}
        <div className="relative">
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className={selectClass.replace('border-[#828BB5]', 'border-[#BABABA]')}
          >
            <option value="" disabled hidden>Any Style</option>
            <option value="automatic">Automatic</option>
            <option value="manual">Manual</option>
            <option value="hybrid">Hybrid</option>
            <option value="electric">Electric</option>
          </select>
          <svg className="pointer-events-none absolute right-3 top-3 w-3 h-3 fill-[#BABABA]" viewBox="0 0 10 6">
            <path d="M0 0l5 6 5-6z" />
          </svg>
        </div>

        {/* Price Range Slider */}
        <div className="flex flex-col gap-2">
          <div className="relative flex items-center h-5">
            {/* Track */}
            <div className="absolute inset-x-0 h-2.5 bg-[#F4C23D] rounded-full" />
            {/* Left endpoint circle */}
            <div className="absolute left-0 w-5 h-5 rounded-full bg-white border border-[#2E3D83]" />
            {/* Right endpoint circle */}
            <div className="absolute right-0 w-5 h-5 rounded-full bg-white border border-[#2E3D83]" />
            {/* Hidden range input for interactivity */}
            <input
              type="range"
              min={0}
              max={100}
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="absolute inset-x-0 w-full opacity-0 h-5 cursor-pointer"
            />
          </div>
          {/* Price label */}
          <p className="font-['Lato'] font-medium text-sm text-white text-center">
            Price: $30,000 – ${currentPrice.toLocaleString()}
          </p>
        </div>

        {/* Filter Button */}
        <button
          onClick={() => {
            if (!onFilter) return;
            const filters: FilterValues = {};
            if (carType) filters.type = carType;
            if (color) filters.color = color;
            if (make) filters.make = make;
            if (model) filters.model = model;
            if (style) filters.style = style;
            // only apply price filter if slider has been moved from default
            if (priceRange < 100) {
              filters.minPrice = '0';
              filters.maxPrice = String(Math.round((priceRange / 100) * maxPrice));
            }
            onFilter(filters);
          }}
          className="w-full h-[50px] bg-[#F4C23D] rounded font-['Lato'] font-bold text-lg tracking-[0.045em] text-black hover:bg-[#e6b030] transition-colors"
        >
          Filter
        </button>
      </div>
    </div>
  );
};

export default FilterCard;
