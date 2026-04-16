import React from 'react'

const Brands = () => {
  const brands = [
    "/brand-logo-1.png",
    "/brand-logo-2.png",
    "/brand-logo-3.png",
    "/brand-logo-4.png",
    "/brand-logo-5.png"
  ]

  return (
    <div className='bg-black py-6 px-6 md:px-[101px]'>
      <div className='flex flex-wrap'>
        {brands.map((item, index) => (
          <div
            key={index}
            className='w-1/3 md:w-1/5 flex justify-center mx-auto mb-4 md:mb-0'
          >
            <img src={item} alt="brand" className='h-8' />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Brands