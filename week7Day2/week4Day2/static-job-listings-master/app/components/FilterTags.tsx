"use client";

import React from "react";
import { useFilterStore } from "@/app/store/filterStore";

const FilterTags = () => {
  const { filters, removeFilter, clearFilters } = useFilterStore();
  const hasFilters = filters.length > 0;

  if (!hasFilters) return null;

  return (
    <div className="bg-white rounded-lg p-4 shadow-md md:mb-6 mb-9 -mt-15 flex items-center justify-between flex-wrap gap-4">
      <div className="flex flex-wrap gap-3 flex-1">
        {filters.map((filter) => (
          <div
            key={filter}
            className="flex items-center bg-teal-100 text-teal-700 font-semibold text-sm rounded-md overflow-hidden"
          >
            <span className="px-3 py-1">{filter}</span>

            <button
              onClick={() => removeFilter(filter)}
              className="px-2 py-1 bg-teal-600 text-white hover:bg-black transition-colors cursor-pointer"
              aria-label={`Remove ${filter} filter`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={clearFilters}
        className="text-gray-600 hover:text-black hover:underline cursor-pointer font-semibold transition-colors text-sm whitespace-nowrap"
      >
        Clear
      </button>
    </div>
  );
};

export default FilterTags;
