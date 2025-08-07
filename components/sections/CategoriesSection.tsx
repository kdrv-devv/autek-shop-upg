"use client";

import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useAxios } from "@/hooks/useAxios";
import Image from "next/image";

interface Category {
  id: number;
  title: string;
  image: string;
}

export function CategoriesSection() {
  const [categories, setCategory] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const axios = useAxios();

  const getCategory = async () => {
    try {
      let data = await axios({ url: "category", method: "GET" });
      setCategory(data.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {getCategory()}, []);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Популярные категории
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Выберите категорию и найдите именно то, что вам нужно
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={2}
            navigation={{
              nextEl: ".category-swiper-button-next",
              prevEl: ".category-swiper-button-prev",
            }}
            pagination={{
              clickable: true,
              el: ".category-swiper-pagination",
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 6 },
              1280: { slidesPerView: 8 },
            }}
            className="category-swiper pb-12"
          >
            {categories.map((category, index) => (
              <SwiperSlide key={category.id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{
                    scale: 1.05,
                    y: -5,
                  }}
                  onClick={() =>
                    (window.location.href = `/category/${category?.title.toLowerCase()}`)
                  }
                  className="group py-10  cursor-pointer"
                >
                  <div className="bg-white h-[150px] rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-2xl hover:border-orange-200 transition-all duration-300 relative overflow-hidden">
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Content */}
                    <div className="relative h-full    z-10 flex flex-col items-center !justify-between text-center">
                      <Image src={ `http://localhost:3000/${category.image as string}` } width={60} height={60} alt={category.title || "Icon"} className="text-4xl  group-hover:scale-110 transition-transform duration-300"/>
                       
                      
                      <h3 className="text-sm font-semibold text-slate-700 group-hover:text-orange-600 transition-colors duration-300 mb-2">
                        {category.title}
                      </h3>

                      {/* Hover Arrow */}
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-center text-orange-500 opacity-0 group-hover:opacity-100 transition-all duration-300"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </motion.div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-2 right-2 w-8 h-8 bg-gradient-to-br from-orange-200 to-pink-200 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                    <div className="absolute bottom-2 left-2 w-6 h-6 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation */}
          <div className="flex items-center  justify-center space-x-4 mt-8">
            <button className="category-swiper-button-prev w-12 h-12 bg-white rounded-full shadow-lg border border-slate-200 flex items-center justify-center hover:bg-orange-50 hover:border-orange-200 transition-colors">
              <ArrowRight className="h-5 w-5 rotate-180 text-slate-600" />
            </button>
            <div className="category-swiper-pagination flex space-x-2"></div>
            <button className="category-swiper-button-next w-12 h-12 bg-white rounded-full shadow-lg border border-slate-200 flex items-center justify-center hover:bg-orange-50 hover:border-orange-200 transition-colors">
              <ArrowRight className="h-5 w-5 text-slate-600" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
