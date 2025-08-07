"use client";

import { motion } from "framer-motion";
import { Star, ShoppingCart, Heart, Eye } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAxios } from "@/hooks/useAxios";
import { Rate } from 'antd';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  image: string;
  rate: number;
  uzum_link:string
}

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const axios = useAxios();

  const fetchPopularProd = async () => {
    let data = await axios({ url: "popular-prod", method: "GET" });
    setProducts(data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPopularProd();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-2 text-sm font-medium mb-4">
            Хиты продаж
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Популярные товары
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Самые востребованные товары с отличными отзывами и гарантией
            качества
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              onClick={() => window.open(product.uzum_link, "_blank")}
              className="group cursor-pointer"
            >
              <div className="bg-white rounded-3xl h-[580px] shadow-xl border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500 relative">
                {/* Product Image Section */}
                <div className="relative h-80 bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
                  {/* Discount Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-red-500 text-white px-3 py-1 text-sm font-bold">
                      -22%
                    </Badge>
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                    >
                      <Heart className="h-5 w-5 text-slate-600 hover:text-red-500 transition-colors" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                    >
                      <Eye className="h-5 w-5 text-slate-600 hover:text-blue-500 transition-colors" />
                    </motion.button>
                  </div>

                  {/* Product Image */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-full h-full flex items-center justify-center p-8"
                  >
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="object-contain max-w-full max-h-full drop-shadow-2xl"
                    />
                  </motion.div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Product Info Section */}
                <div className="p-8">
                  {/* Rating */}
                  <div className="flex items-start space-x-2 mb-4">
                    <div className="flex items-center">
                      <Rate disabled defaultValue={product?.rate} />
                    </div>
                    <span className="text-sm text-slate-600 font-medium">
                     ( {product.rate} )
                    </span>
                  </div>

                  {/* Product Name */}
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-orange-600 transition-colors">
                    {product.name}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {["5G", "128GB", "50MP"].map((feature) => (
                      <span
                        key={feature}
                        className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Price and Action */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                          {product.price}
                        </span>
                        <span className="text-lg text-slate-400 line-through">
                          {product.originalPrice}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500">
                        или от 2,330 ₽/мес
                      </p>
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                      >
                        <ShoppingCart className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                        Купить
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link target="_blank" href={"https://uzum.uz/uz/shop/autek"}>
            <Button
              variant="outline"
              size="xl"
              className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-12 py-4 rounded-2xl font-semibold transition-all duration-300 bg-transparent"
            >
              Посмотреть все товары
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
