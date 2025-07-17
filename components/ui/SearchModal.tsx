"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("")

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
              {query.length > 0 ? (
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 mb-4">Результаты поиска</h3>
                  <p className="text-slate-500">Поиск по запросу "{query}"...</p>
                </div>
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
