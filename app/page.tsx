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

const categories = [
  { id: 1, name: "Картридж", icon: "🖨️" },
  { id: 2, name: "Монитор", icon: "🖥️" },
  { id: 3, name: "Видео регистратор", icon: "📹" },
  { id: 4, name: "Планшет", icon: "📱" },
  { id: 5, name: "Сервис", icon: "🔧" },
  { id: 6, name: "Акции", icon: "🏷️" },
  { id: 7, name: "Ноутбук", icon: "💻" },
  { id: 8, name: "Телефон", icon: "📞" },
]

const products = [
  {
    id: 1,
    name: "POCO X5 Pro 5G",
    description: "Процессор Snapdragon 778G | 120Гц AMOLED дисплей",
    price: "от 24 990 ₽",
    originalPrice: "29 990 ₽",
    image: "https://i04.appmifile.com/826_item_ru/10/07/2023/36ce2c7bd69f5d4e7e128c38e7d66f26!400x400!85.png",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Серия Xiaomi TV A2",
    description: "Умная работа, безграничные возможности",
    price: "от 19 990 ₽",
    originalPrice: "24 990 ₽",
    image: "https://cdn.ksyru0-fusion.fds.api.mi-img.com/b2c-mishop-pms-ru/pms_1673936257.23516880.png?w=400&h=400&thumb=1",
    rating: 4.6,
  },
]

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
        <CategoriesSection categories={categories} />
        <FeaturedProducts products={products} />
        <NewsletterSection />
      </main>
      <Footer />
      <FloatingCart cartCount={cartCount} />
      <BackToTop />
    </div>
  )
}
