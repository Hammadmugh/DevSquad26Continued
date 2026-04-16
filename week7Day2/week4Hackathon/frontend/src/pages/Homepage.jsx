import React from 'react'
import Hero from '../components/Hero'
import WideVarCard from '../components/WideVarCard'
import FeaturesSection from '../components/FeaturesSection'
import FAQSection from '../components/FAQSection'
import PricingCards from '../components/PricingCards'
import BrandCarousel from '../components/BrandCarousel'
import { moviesCoursel } from '/data'


const Homepage = () => {
  return (
    <>
      <Hero/>
      <WideVarCard/>
      <FeaturesSection/>
      <FAQSection/>
      <PricingCards/>
      <BrandCarousel images={moviesCoursel}/>
    </>
  )
}

export default Homepage
