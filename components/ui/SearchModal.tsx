"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useAxios } from "@/hooks/useAxios"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("")
  const [products, setProducts] = useState<any[]>([])
  const axios = useAxios()

  // API dan mahsulotlarni olish
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await axios({ url: "product", method: "GET" })
        setProducts(data.data)
      } catch (err) {
        console.error("Mahsulotlarni olishda xatolik:", err)
      }
    }
    fetchProducts()
  }, [])

  // Query asosida filterlangan natijalar
  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase())
  )

  // Product detail page ga yo‘naltirish
  const goToProduct = (product: any) => {
    window.location.href = `/product/${product.id}`
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[55]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -50 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-24 inset-x-4 sm:top-20 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 w-auto sm:w-[calc(100%-2rem)] sm:max-w-2xl bg-white rounded-2xl shadow-2xl z-[55] max-h-[80vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center p-4 sm:p-6 border-b border-slate-200">
              <Search className="h-5 w-5 text-slate-400 mr-3 flex-shrink-0" />
              <Input
                type="text"
                placeholder="Поиск товаров..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 border-none focus:ring-0 text-base sm:text-lg"
                autoFocus
              />
              <button
                onClick={onClose}
                className="ml-3 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 max-h-[calc(80vh-70px)] overflow-y-auto">
              {query.length > 0 && filteredProducts.length > 0 ? (
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 mb-4 flex items-center">
                    <Search className="h-4 w-4 mr-2" />
                    Результаты поиска
                  </h3>
                  {filteredProducts.map((product, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center justify-between p-3 hover:bg-orange-50 rounded-xl cursor-pointer transition-colors group"
                      onClick={() => goToProduct(product)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                          <Search className="h-5 w-5 text-orange-600" />
                        </div>
                        <span className="text-slate-700 group-hover:text-orange-600 transition-colors">
                          {product.title}
                        </span>
                      </div>
                      {product.trending && (
                        <div className="flex items-center space-x-1 text-red-500">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-xs font-medium">Популярно</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : query.length > 0 && filteredProducts.length === 0 ? (
                <p className="text-slate-500">По вашему запросу "{query}" ничего не найдено.</p>
              ) : (
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 mb-4 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Популярные запросы
                  </h3>
                  <div className="space-y-2">
                    {["iPhone 15", "MacBook Air", "AirPods Pro"].map((item) => (
                      <button
                        key={item}
                        onClick={() => setQuery(item)}
                        className="block w-full text-left p-3 hover:bg-slate-50 rounded-lg transition-colors text-sm sm:text-base"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
