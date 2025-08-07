"use client"

import type React from "react"
  import { ToastContainer,  } from 'react-toastify';

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LayoutDashboard, Grid3X3, Star, Package, Sun, Moon, Menu, X, Home, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/Button"

interface AdminLayoutProps {
  children: React.ReactNode
  activeSection: string
  setActiveSection: (section: string) => void
}


const menuItems = [
  { id: "showcase", label: "Showcase", icon: LayoutDashboard },
  { id: "category", label: "Category", icon: Grid3X3 },
  { id: "popular-products", label: "Popular Products", icon: Star },
  { id: "products", label: "Products", icon: Package },
]

export function AdminLayout({ children, activeSection, setActiveSection }: AdminLayoutProps) {
  const [isDark, setIsDark] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDark])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      {/* Desktop Sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50">
          {/* Logo */}
          <div className="flex h-16 flex-shrink-0 items-center px-4 border-b border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AT</span>
              </div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                AU<span className="text-orange-500">TEK</span> Admin
              </h1>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-1 flex-col overflow-y-auto">
            <nav className="flex-1 space-y-1 px-2 py-4">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`group flex w-full items-center rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                    activeSection === item.id
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      activeSection === item.id ? "text-white" : "text-slate-500 dark:text-slate-400"
                    }`}
                  />
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Bottom Actions */}
            <div className="border-t border-slate-200/50 dark:border-slate-700/50 p-4 space-y-2">
              <button className="group flex w-full items-center rounded-xl px-3 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white transition-all duration-200">
                <Home className="mr-3 h-5 w-5 flex-shrink-0 text-slate-500 dark:text-slate-400" />
                Back to Site
              </button>
              <button className="group flex w-full items-center rounded-xl px-3 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white transition-all duration-200">
                <Settings className="mr-3 h-5 w-5 flex-shrink-0 text-slate-500 dark:text-slate-400" />
                Settings
              </button>
              <button className="group flex w-full items-center rounded-xl px-3 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200">
                <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-700/50">
        <div className="grid grid-cols-4 gap-1 p-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all duration-200 ${
                activeSection === item.id
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50"
              }`}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium truncate">{item.label.split(" ")[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-40 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">
              AU<span className="text-orange-500">TEK</span> Admin
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={() => setIsDark(!isDark)} className="w-10 h-10 rounded-xl">
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(true)}
              className="w-10 h-10 rounded-xl"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Theme Toggle */}
      <div className="hidden md:block fixed top-4 right-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDark(!isDark)}
          className="w-12 h-12 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isDark ? <Sun className="h-5 w-5 text-orange-500" /> : <Moon className="h-5 w-5 text-slate-600" />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="md:hidden fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl shadow-2xl z-50"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-200/50 dark:border-slate-700/50">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Menu</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-10 h-10 rounded-xl"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-4 space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id)
                      setIsMobileMenuOpen(false)
                    }}
                    className={`group flex w-full items-center rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                      activeSection === item.id
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="md:pl-64 pb-20 md:pb-0">
        <main className="flex-1">
          <div className="p-4 md:p-8">{children}</div>
        </main>
      </div>
      <ToastContainer/>
    </div>
  )
}
