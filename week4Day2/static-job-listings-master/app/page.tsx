'use client'

import React, { useMemo } from 'react'
import JobCard from './components/JobCard'
import FilterTags from './components/FilterTags'
import data from '@/data.json'
import { useFilterStore } from './store/filterStore'

const page = () => {
  const { filters } = useFilterStore()

  const filteredJobs = useMemo(() => {
    if (filters.length === 0) return data

    return data.filter((job) => {
      const jobTags = [job.role, job.level, ...job.languages, ...job.tools]
      return filters.every((filter) => jobTags.includes(filter))
    })
  }, [filters])

  return (
    <>
      <div className="h-32 max-w-[1400px] mx-auto bg-[url('/bg-header-desktop.svg')] bg-no-repeat bg-cover bg-teal-500"></div>
      <div className="min-h-screen max-w-[1400px] mx-auto bg-green-100 py-8">
        <div className="container mx-auto px-4 lg:max-w-3/4">
          <FilterTags />
          <div className="md:space-y-6 space-y-10">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  id={job.id}
                  company={job.company}
                  logo={job.logo}
                  new={job.new}
                  featured={job.featured}
                  position={job.position}
                  role={job.role}
                  level={job.level}
                  postedAt={job.postedAt}
                  contract={job.contract}
                  location={job.location}
                  languages={job.languages}
                  tools={job.tools}
                />
              ))
            ) : (
              <div className="bg-white rounded-lg p-12 shadow-md text-center">
                <p className="text-gray-600 text-lg font-semibold">
                  No jobs match your filters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default page