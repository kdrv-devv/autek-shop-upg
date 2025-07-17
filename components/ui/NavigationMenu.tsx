"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

const menuItems = [
  {
    title: "Акции",
    items: [
      { title: "Скидки до 50%", href: "/promotions/discounts" },
      { title: "Новинки", href: "/promotions/new" },
      { title: "Распродажа", href: "/promotions/sale" },
    ],
  },
  {
    title: "Магазины",
    items: [
      { title: "Москва", href: "/stores/moscow" },
      { title: "Санкт-Петербург", href: "/stores/spb" },
      { title: "Екатеринбург", href: "/stores/ekb" },
    ],
  },
  {
    title: "Наш партнёр",
    href: "/partners",
  },
  {
    title: "Покупателям",
    items: [
      { title: "Доставка", href: "/delivery" },
      { title: "Оплата", href: "/payment" },
      { title: "Гарантия", href: "/warranty" },
    ],
  },
]

export function NavigationMenu() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  return (
    <nav className="flex items-center space-x-8">
      {menuItems.map((item) => (
        <div
          key={item.title}
          className="relative"
          onMouseEnter={() => setActiveMenu(item.title)}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <button className="flex items-center space-x-1 text-slate-700 hover:text-orange-500 transition-colors font-medium">
            <span>{item.title}</span>
            {item.items && <ChevronDown className="h-4 w-4" />}
          </button>

          <AnimatePresence>
            {activeMenu === item.title && item.items && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 py-2 z-50"
              >
                {item.items.map((subItem) => (
                  <a
                    key={subItem.title}
                    href={subItem.href}
                    className="block px-4 py-3 text-slate-700 hover:text-orange-500 hover:bg-orange-50/50 transition-colors"
                  >
                    {subItem.title}
                  </a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </nav>
  )
}
