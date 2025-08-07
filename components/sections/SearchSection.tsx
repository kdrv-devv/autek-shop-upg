"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, TrendingUp, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useAxios } from "@/hooks/useAxios"

interface SearchSectionProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  showSuggestions: boolean
  setShowSuggestions: (show: boolean) => void
}



export function SearchSection({
  searchQuery,
  setSearchQuery,
  showSuggestions,
  setShowSuggestions,
}: SearchSectionProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const axios = useAxios()
  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const data = await  axios({url:"product" , method:"GET"})
      setProducts(data.data)
    } catch (err) {
      console.error("Mahsulotlarni olishda xatolik:", err)
    }
  }

  fetchProducts()
}, [])



  const filteredSuggestions = products.filter((suggestion) =>
    suggestion.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )


  const goFullData = (product:any) => {
    return window.location.href = `/product/${product.id}`
  }


  return (
    <section className="py-12 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          {/* Search Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Найдите то, что ищете</h2>
            <p className="text-slate-600 text-lg">Более 10,000 товаров в нашем каталоге</p>
          </div>

          {/* Search Container */}
          <div className="relative">
            <motion.div
              className={`relative transition-all duration-300 ${isFocused ? "scale-105 shadow-2xl" : "shadow-lg"}`}
              whileFocus={{ scale: 1.02 }}
            >
              <div className="absolute left-6 top-1/2 transform -translate-y-1/2 text-slate-400 z-10">
                <Search className="h-6 w-6" />
              </div>

              <Input
                type="text"
                placeholder="Поиск товаров, брендов, категорий..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  setIsFocused(true)
                  setShowSuggestions(true)
                }}
                onBlur={() => {
                  setIsFocused(false)
                  setTimeout(() => setShowSuggestions(false), 200)
                }}
                className="w-full pl-16 pr-6 py-6 text-lg rounded-2xl border-2 border-slate-200 focus:border-orange-500 bg-white/80 backdrop-blur-sm transition-all duration-300"
              />

              {/* Search Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Найти
              </motion.button>
            </motion.div>

            {/* Search Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && (searchQuery.length > 0 ) && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 mt-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 overflow-hidden z-50"
                >
                  {/* Search Results */}
                  {searchQuery.length > 0 && filteredSuggestions.length > 0 && (
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-slate-500 mb-3 flex items-center">
                        <Search className="h-4 w-4 mr-2" />
                        Результаты поиска
                      </h3>
                      {filteredSuggestions.map((suggestion:any, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center justify-between p-3 hover:bg-orange-50 rounded-xl cursor-pointer transition-colors group"
                          onClick={() => {
                            setSearchQuery(suggestion.title)
                            setShowSuggestions(false)
                            goFullData(suggestion)
                            
                          }}
                     
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                              <Search className="h-5 w-5 text-orange-600" />
                            </div>
                            <span className="text-slate-700 group-hover:text-orange-600 transition-colors">
                              {suggestion.title}
                            </span>
                          </div>
                          {suggestion.trending && (
                            <div className="flex items-center space-x-1 text-red-500">
                              <TrendingUp className="h-4 w-4" />
                              <span className="text-xs font-medium">Популярно</span>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}

                

                  {/* Popular Categories */}
                  <div className="p-4 bg-slate-50/50 border-t border-slate-100">
                    <h3 className="text-sm font-semibold text-slate-500 mb-3">Популярные категории</h3>
                    <div className="flex flex-wrap gap-2">
                      {["Смартфоны", "Ноутбуки", "Наушники", "Планшеты"].map((category) => (
                        <motion.button
                          key={category}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-white rounded-full text-sm text-slate-600 hover:text-orange-600 hover:bg-orange-50 transition-colors border border-slate-200"
                          onClick={() => {
                            setSearchQuery(category)
                            setShowSuggestions(false)
                          }}
                        >
                          {category}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex justify-center items-center space-x-8 mt-8 text-sm text-slate-500"
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>1,000+ товаров</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Быстрая доставка</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>Гарантия качества</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
