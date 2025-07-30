"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Filter, SlidersHorizontal, Grid3X3, List } from "lucide-react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import Link from "next/link"
import Image from "next/image"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  useEffect(() => {
    setTimeout(() => {
      setProducts([
        {
          id: 1,
          name: "POCO X5 Pro 5G",
          description: "Процессор Snapdragon 778G | 120Гц AMOLED дисплей",
          price: "от 24 990 ₽",
          originalPrice: "29 990 ₽",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLj-lE559vEBTgT7Zo0cZ7JH22jlU3IEILfA&s",
          rating: 4.8,
        },
        {
          id: 2,
          name: "Серия Xiaomi TV A2",
          description: "Умная работа, безграничные возможности",
          price: "от 19 990 ₽",
          originalPrice: "24 990 ₽",
          image: "https://mi-store.uz/wp-content/uploads/2025/02/4533d341874428fe681293b08f39a81d_800x800_100-768x768.png",
          rating: 4.6,
        },
        {
          id: 3,
          name: "Redmi Note 12 Pro",
          description: "Мощный процессор и яркий дисплей",
          price: "от 22 990 ₽",
          originalPrice: "26 990 ₽",
          image: "https://i02.appmifile.com/2_operator_sg/06/03/2023/e1747d55b1a25c610053b35956c2bfa3.png",
          rating: 4.7,
        },
        {
          id: 4,
          name: "Xiaomi 13T",
          description: "Профессиональная камера Leica",
          price: "от 39 990 ₽",
          originalPrice: "44 990 ₽",
          image: "https://i02.appmifile.com/308_operatorx_operatorx_opx/26/09/2023/4796e703846ff6b8afdca74fc2755a10.png",
          rating: 4.9,
        },
      ])
      setIsLoading(false)
    }, 1000)
  }, [slug])

  const categoryName = decodeURIComponent(slug).charAt(0).toUpperCase() + decodeURIComponent(slug).slice(1)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <div className="flex items-center text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:text-orange-500 transition-colors">
              Главная
            </Link>
            <span className="mx-2">/</span>
            <span className="font-medium text-slate-700">{categoryName}</span>
          </div>

          {/* Category Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{categoryName}</h1>
              <p className="text-slate-600">Найдено {isLoading ? "..." : products.length} товаров</p>
            </div>
            <Link href="/" className="flex items-center text-orange-500 hover:text-orange-600 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Вернуться на главную
            </Link>
          </div>

          {/* Filters and Products */}
          <div className="grid md:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="hidden md:block">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                  <Filter className="h-5 w-5 mr-2 text-orange-500" />
                  Фильтры
                </h2>

                {/* Price Range */}
                <div className="mb-6">
                  <h3 className="font-medium text-slate-800 mb-3">Цена</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <input
                        type="range"
                        min="0"
                        max="100000"
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">от 0 ₽</span>
                      <span className="text-sm text-slate-600">до 100 000 ₽</span>
                    </div>
                  </div>
                </div>

                {/* Brand Filter */}
                <div className="mb-6">
                  <h3 className="font-medium text-slate-800 mb-3">Бренд</h3>
                  <div className="space-y-2">
                    {["Xiaomi", "Redmi", "POCO", "Apple", "Samsung"].map((brand) => (
                      <div key={brand} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`brand-${brand}`}
                          className="w-4 h-4 text-orange-500 border-slate-300 rounded focus:ring-orange-500"
                        />
                        <label htmlFor={`brand-${brand}`} className="ml-2 text-sm text-slate-700">
                          {brand}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features Filter */}
                <div className="mb-6">
                  <h3 className="font-medium text-slate-800 mb-3">Особенности</h3>
                  <div className="space-y-2">
                    {["5G", "NFC", "Быстрая зарядка", "Беспроводная зарядка"].map((feature) => (
                      <div key={feature} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`feature-${feature}`}
                          className="w-4 h-4 text-orange-500 border-slate-300 rounded focus:ring-orange-500"
                        />
                        <label htmlFor={`feature-${feature}`} className="ml-2 text-sm text-slate-700">
                          {feature}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">Применить</Button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="md:col-span-3">
              {/* Mobile Filters */}
              <div className="flex items-center justify-between mb-6 md:hidden">
                <Button variant="outline" size="sm" className="flex items-center bg-transparent">
                  <Filter className="h-4 w-4 mr-2" />
                  Фильтры
                </Button>
                <Button variant="outline" size="sm" className="flex items-center bg-transparent">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Сортировка
                </Button>
              </div>

              {/* View Mode and Sort */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg ${
                      viewMode === "grid" ? "bg-orange-100 text-orange-500" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <Grid3X3 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg ${
                      viewMode === "list" ? "bg-orange-100 text-orange-500" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>

                <div className="hidden md:block">
                  <select className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option>По популярности</option>
                    <option>По цене (возрастание)</option>
                    <option>По цене (убывание)</option>
                    <option>По рейтингу</option>
                  </select>
                </div>
              </div>

              {/* Products */}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white rounded-2xl shadow animate-pulse h-80"></div>
                  ))}
                </div>
              ) : (
                <>
                  {viewMode === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {products.map((product) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
                        >
                          <Link href={`/product/${product.id}`} className="block">
                            <div className="relative h-48 bg-slate-50">
                              <Badge className="absolute top-3 left-3 bg-red-500 text-white">-15%</Badge>
                              <Image
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                fill
                                className="object-contain p-4"
                              />
                            </div>
                            <div className="p-4">
                              <h3 className="font-semibold text-slate-900 group-hover:text-orange-500 transition-colors">
                                {product.name}
                              </h3>
                              <p className="text-sm text-slate-600 mt-1 line-clamp-2">{product.description}</p>
                              <div className="mt-4 flex items-baseline space-x-2">
                                <span className="text-lg font-bold text-orange-500">{product.price}</span>
                                <span className="text-sm text-slate-400 line-through">{product.originalPrice}</span>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {products.map((product) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
                        >
                          <Link href={`/product/${product.id}`} className="flex">
                            <div className="relative w-40 h-40 bg-slate-50 flex-shrink-0">
                              <Badge className="absolute top-3 left-3 bg-red-500 text-white">-15%</Badge>
                              <Image
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                fill
                                className="object-contain p-4"
                              />
                            </div>
                            <div className="p-4 flex-1">
                              <h3 className="font-semibold text-slate-900 group-hover:text-orange-500 transition-colors">
                                {product.name}
                              </h3>
                              <p className="text-sm text-slate-600 mt-1">{product.description}</p>
                              <div className="mt-4 flex items-baseline space-x-2">
                                <span className="text-lg font-bold text-orange-500">{product.price}</span>
                                <span className="text-sm text-slate-400 line-through">{product.originalPrice}</span>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Pagination */}
              <div className="mt-12 flex justify-center">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="w-10 h-10 p-0 bg-transparent">
                    &lt;
                  </Button>
                  {[1, 2, 3, 4, 5].map((page) => (
                    <Button
                      key={page}
                      variant={page === 1 ? "default" : "outline"}
                      size="sm"
                      className={`w-10 h-10 p-0 ${page === 1 ? "bg-orange-500" : ""}`}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button variant="outline" size="sm" className="w-10 h-10 p-0 bg-transparent">
                    &gt;
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
