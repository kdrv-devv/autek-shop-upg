"use client"

import { useState } from "react"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { Header } from "@/components/layout/Header"
import { HeroSection } from "@/components/sections/HeroSection"
import { SearchSection } from "@/components/sections/SearchSection"
import { CategoriesSection } from "@/components/sections/CategoriesSection"
import { FeaturedProducts } from "@/components/sections/FeaturedProducts"
import { NewsletterSection } from "@/components/sections/NewsletterSection"
import { Footer } from "@/components/layout/Footer"
import { FloatingCart } from "@/components/ui/FloatingCart"
import { BackToTop } from "@/components/ui/BackToTop"


export default function HomePage() {

  const [searchQuery, setSearchQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [cartCount] = useState(3)
  

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Header />
      <main className="relative">
        <HeroSection />
        <SearchSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showSuggestions={showSuggestions}
          setShowSuggestions={setShowSuggestions}
        />
        <CategoriesSection />
        <FeaturedProducts  />
        <NewsletterSection />
      </main>
      <Footer />
      <FloatingCart cartCount={cartCount} />
      <BackToTop />
    </div>
  )
}
