"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, ShoppingCart, Menu, Heart, Bell } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { NavigationMenu } from "@/components/ui/NavigationMenu"
import { UserMenu } from "@/components/ui/UserMenu"
import { SearchModal } from "@/components/ui/SearchModal"
import { MobileMenu } from "@/components/ui/MobileMenu"
import { useCart } from "@/hooks/useCart"
import { useScrollDirection } from "@/hooks/useScrollDirection"

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { items } = useCart()
  const scrollDirection = useScrollDirection()

  return (

    
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: scrollDirection === "up" ? 0 : -100 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-[55] bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-2">
             
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                AU<span className="text-orange-500">TEK</span>
              </h1>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <NavigationMenu />
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              {/* Search */}
             <div className="flex items-center">
               <Button
               id="search-btn"
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="relative hover:bg-slate-100 transition-colors"
              >
                <Search className="h-5 w-5" /> 
              </Button>
                <label className="cursor-pointer" htmlFor="search-btn" >Search</label>
             </div> 
            
             

            


              {/* Mobile Menu */}
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  )
}
