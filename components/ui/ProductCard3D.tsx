"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import Image from "next/image"

export function ProductCard3D({ img , title } : {img:any , title:any , loading:any}) {
  const [isHovered, setIsHovered] = useState(false)
  

  return (
    <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] flex items-center justify-center">
      {/* Floating Elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="absolute top-10 left-2 sm:left-10 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl opacity-20"
      />

      <motion.div
        animate={{
          y: [0, 15, 0],
          rotate: [0, -3, 0],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-20 right-2 sm:right-10 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full opacity-20"
      />

      {/* Main Product Container */}
      <motion.div
        className="relative w-full max-w-[280px] sm:max-w-[350px] lg:max-w-none"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        {/* Glow Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-400 rounded-3xl blur-3xl opacity-30"
          animate={{
            scale: isHovered ? 1.2 : 1,
            opacity: isHovered ? 0.5 : 0.3,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Product Card */}
        <motion.div
          className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/20 shadow-2xl"
          animate={{
            rotateY: isHovered ? 15 : 0,
            rotateX: isHovered ? -5 : 0,
          }}
          transition={{ duration: 0.3 }}
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {/* Product Image */}
          <motion.div
            className="relative w-full h-[250px] sm:h-[300px] lg:h-[350px]"
            animate={{
              z: isHovered ? 50 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
              <Image
              src={`http://localhost:3000/${img}`}
              alt={title && "AUTEK MAXSULOTI"}
              fill
              className="object-contain drop-shadow-2xl"
            />
          </motion.div>

          {/* Floating Specs */}
          <motion.div
            className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 bg-white/90 backdrop-blur-sm rounded-2xl p-2 sm:p-4 shadow-lg border border-white/30"
            animate={{
              y: isHovered ? -10 : 0,
              z: isHovered ? 30 : 0,
            }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold text-orange-500">Новый</div>
              <div className="text-xs text-slate-600">продукт</div>
            </div>
          </motion.div>

          <motion.div
            className="absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 bg-white/90 backdrop-blur-sm rounded-2xl p-2 sm:p-4 shadow-lg border border-white/30"
            animate={{
              y: isHovered ? 10 : 0,
              z: isHovered ? 30 : 0,
            }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold text-blue-500">New</div>
              <div className="text-xs text-slate-600">product</div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
