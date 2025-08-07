"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Filter,
  SlidersHorizontal,
  Grid3X3,
  List,
  ShoppingCart,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import Image from "next/image";
import { useAxios } from "@/hooks/useAxios";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

interface Price {
  current: number; // Joriy narx
  old_price: number; // Eski narx
  discount: number; // Chegirma foizda
}

interface Product {
  id: number; // Unikal ID (katta raqam, ehtimol timestamp)
  title: string; // Mahsulot nomi
  rate: number; // Reyting (masalan, 4.3)
  price: Price; // Narxlar to'plami
  description: string; // Qisqacha tavsif
  full_description: string; // To‘liq tavsif
  uzum_link: string; // Tashqi havola (Uzum sahifasi)
  images: string[]; // Rasmlar ro‘yxati (pathlar)
  category: string; // Kategoriya nomi (masalan: "phones")
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const axios = useAxios();

  const getProducts = async () => {
    try {
      let data = await axios({
        url: `category?title=${slug as string}`,
        method: "GET",
      });
      setProducts(data?.data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, [slug]);

  const categoryName =
    decodeURIComponent(slug).charAt(0).toUpperCase() +
    decodeURIComponent(slug).slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <div className="flex items-center text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:text-orange-500 transition-colors">
              Главная
            </Link>
            <span className="mx-2">/</span>
            <span className="font-medium text-slate-700">{categoryName}</span>
          </div>

          {/* Category Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                {categoryName}
              </h1>
              <p className="text-slate-600">
                Найдено {isLoading ? "..." : products.length} товаров
              </p>
            </div>
            <Link
              href="/"
              className="flex items-center text-orange-500 hover:text-orange-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Вернуться на главную
            </Link>
          </div>

          {/* Filters and Products */}
          <div className="grid md:grid-cols-4 gap-8">
            {/* Filters Sidebar */}

            {/* Products Grid */}
            <div className="md:col-span-4">
              {/* Mobile Filters */}
              <div className="flex items-center justify-between mb-6 md:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center bg-transparent"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Фильтры
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center bg-transparent"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Сортировка
                </Button>
              </div>

              {/* View Mode and Sort */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg ${
                      viewMode === "grid"
                        ? "bg-orange-100 text-orange-500"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <Grid3X3 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg ${
                      viewMode === "list"
                        ? "bg-orange-100 text-orange-500"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>

                <div className="hidden md:block">
                  <select className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option>По популярности</option>
                    <option>По цене (возрастание)</option>
                    <option>По цене (убывание)</option>
                    <option>По рейтингу</option>
                  </select>
                </div>
              </div>

              {/* Products */}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl shadow animate-pulse h-80"
                    ></div>
                  ))}
                </div>
              ) : (
                <>
                  {viewMode === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {products.map((product) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
                        >
                          <Link
                            href={`/product/${product.id}`}
                            className="block"
                          >
                            <div className="relative h-48 bg-slate-50">
                              <Badge className="absolute top-3 left-3 bg-red-500 text-white">
                                -15%
                              </Badge>
                              <Image
                                src={
                                  `http://localhost:3000/${product.images[0]}` ||
                                  "/placeholder.svg"
                                }
                                alt={product.title}
                                fill
                                className="object-contain p-4"
                              />
                            </div>
                            <div className="p-4">
                              <h3 className="font-semibold text-slate-900 group-hover:text-orange-500 transition-colors">
                                {product.title}
                              </h3>
                              <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                                {product.description}
                              </p>
                              <div className="mt-4 flex items-baseline space-x-2">
                                <span className="text-lg font-bold text-orange-500">
                                  {product.price.current}
                                </span>
                                <span className="text-sm text-slate-400 line-through">
                                  {product.price.old_price}
                                </span>
                              </div>

                              <Link target="_blank" href={product.uzum_link}>
                                <motion.div
                                    whileHover={{ scale: 1.03 }}
                                  whileTap={{ scale: 0.73 }}
                                >
                                  <Button
                                    size="lg"
                                    className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                                  >
                                    <ShoppingCart className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                                    Купить
                                  </Button>
                                </motion.div>
                              </Link>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {products.map((product) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
                        >
                          <Link
                            href={`/product/${product.id}`}
                            className="flex"
                          >
                            <div className="relative w-40 h-40 bg-slate-50 flex-shrink-0">
                              <Badge className="absolute top-3 left-3 bg-red-500 text-white">
                                -15%
                              </Badge>
                              <Image
                                src={
                                  `http://localhost:3000/${product.images[0]}` ||
                                  "/placeholder.svg"
                                }
                                alt={product.title}
                                fill
                                className="object-contain p-4"
                              />
                            </div>
                            <div className="p-4 flex-1">
                              <h3 className="font-semibold text-slate-900 group-hover:text-orange-500 transition-colors">
                                {product.title}
                              </h3>
                              <p className="text-sm text-slate-600 mt-1">
                                {product.description}
                              </p>
                              <div className="mt-4 flex items-baseline space-x-2">
                                <span className="text-lg font-bold text-orange-500">
                                  {product.price.current}
                                </span>
                                <span className="text-sm text-slate-400 line-through">
                                  {product.price.old_price}
                                </span>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Pagination */}
              <div className="mt-12 flex justify-center">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-10 h-10 p-0 bg-transparent"
                  >
                    &lt;
                  </Button>
                  {[1, 2, 3, 4, 5].map((page) => (
                    <Button
                      key={page}
                      variant={page === 1 ? "default" : "outline"}
                      size="sm"
                      className={`w-10 h-10 p-0 ${
                        page === 1 ? "bg-orange-500" : ""
                      }`}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-10 h-10 p-0 bg-transparent"
                  >
                    &gt;
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
