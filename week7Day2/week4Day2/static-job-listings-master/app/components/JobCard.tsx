'use client'

import React from 'react'
import { useFilterStore } from '@/app/store/filterStore'

interface JobListingProps {
  id: number
  company: string
  logo: string
  new: boolean
  featured: boolean
  position: string
  role: string
  level: string
  postedAt: string
  contract: string
  location: string
  languages: string[]
  tools: string[]
}

const JobCard: React.FC<JobListingProps> = ({
  id,
  company,
  logo,
  new: isNew,
  featured,
  position,
  role,
  level,
  postedAt,
  contract,
  location,
  languages,
  tools
}) => {
  const { addFilter } = useFilterStore()
  const allTags = [role, level, ...languages, ...tools]

  const handleTagClick = (tag: string) => {
    addFilter(tag)
  }

  return (
    <div className={`bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow cursor-pointer ${featured ? "border-l-4 border-teal-500" : ""}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between md:gap-8">
          <img src={logo} alt={company} className="w-12 h-12 rounded-full -mt-13 mb-6 md:hidden" />
        <div className="flex items-center gap-4 flex-1">
          <img src={logo} alt={company} className="w-12 h-12 rounded-full hidden md:block" />
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-gray-700 font-semibold text-sm">{company}</h3>
              {isNew && <span className="bg-teal-500 text-white text-xs font-bold text-center px-2 py-1 rounded-full">NEW</span>}
              {featured && <span className="bg-gray-700 text-white text-xs font-bold text-center px-2 py-1 rounded-full">FEATURED</span>}
            </div>
            <h2 className="text-gray-900 font-bold text-lg mb-2">{position}</h2>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <span>{postedAt}</span>
              <span>•</span>
              <span>{contract}</span>
              <span>•</span>
              <span>{location}</span>
            </div>
          </div>
        </div>
        
        <hr className="my-4 md:hidden" />
        
        <div className="flex flex-wrap gap-2 md:justify-end">
          {allTags.map((tag, index) => (
            <button
              key={index}
              onClick={() => handleTagClick(tag)}
              className="bg-teal-50 text-teal-600 font-semibold text-sm px-3 py-1 rounded-md hover:bg-teal-500 hover:text-white transition-colors whitespace-nowrap cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default JobCard