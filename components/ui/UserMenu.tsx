"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Settings, Heart, Package, LogOut, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/Button"

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative hover:bg-slate-100 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <ChevronDown className="h-4 w-4 text-slate-600" />
        </div>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 py-2 z-50"
          >
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-sm font-medium text-slate-900">Иван Петров</p>
              <p className="text-xs text-slate-500">ivan@example.com</p>
            </div>

            {[
              { icon: User, label: "Профиль", href: "/profile" },
              { icon: Package, label: "Мои заказы", href: "/orders" },
              { icon: Heart, label: "Избранное", href: "/wishlist" },
              { icon: Settings, label: "Настройки", href: "/settings" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center space-x-3 px-4 py-3 text-slate-700 hover:text-orange-500 hover:bg-orange-50/50 transition-colors"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </a>
            ))}

            <div className="border-t border-slate-100 mt-2">
              <button className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors w-full text-left">
                <LogOut className="h-4 w-4" />
                <span>Выйти</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
