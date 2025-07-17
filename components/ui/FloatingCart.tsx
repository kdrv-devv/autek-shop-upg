"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, X, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"

interface FloatingCartProps {
  cartCount: number
}

export function FloatingCart({ cartCount }: FloatingCartProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating Cart Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full shadow-2xl flex items-center justify-center text-white relative"
        >
          <ShoppingCart className="h-6 w-6" />
          {cartCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-6 w-6 text-xs bg-red-500 border-2 border-white">
              {cartCount}
            </Badge>
          )}
        </motion.button>
      </motion.div>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Cart Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-900">Корзина</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Cart Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {cartCount > 0 ? (
                  <div className="space-y-4">
                    {/* Sample Cart Items */}
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl">
                        <div className="w-16 h-16 bg-slate-200 rounded-lg"></div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900">iPhone 15 Pro</h3>
                          <p className="text-sm text-slate-600">128GB, Черный</p>
                          <p className="font-bold text-orange-500">89 990 ₽</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center">1</span>
                          <button className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center">
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">Корзина пуста</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              {cartCount > 0 && (
                <div className="p-6 border-t border-slate-200 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Итого:</span>
                    <span className="text-2xl font-bold text-orange-500">269 970 ₽</span>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-4 rounded-xl font-semibold">
                    Оформить заказ
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
