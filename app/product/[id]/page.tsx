"use client";

import { useEffect, useState } from "react";
import {
  Heart,
  Share2,
  ShoppingCart,
  Check,
  ArrowLeft,
  Loader,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import Image from "next/image";
import { useAxios } from "@/hooks/useAxios";
import { Rate } from 'antd';


interface ProductPageProps {
  params: {
    id: string;
  };
}

interface Price {
  current: number; // Hozirgi narx
  old_price: number; // Eski narx
  discount: number; // Foizli chegirma
}

interface Product {
  id: number;
  title: string;
  rate: number; // Reyting (masalan: 4.5)
  price: Price; // Narx bo‘limi - alohida interface orqali
  description: string; // Mahsulot tavsifi
  uzum_link: string; // Uzumdagi mahsulot sahifasi havolasi
  image: string; // Mahsulot rasmi uchun pathlar ro‘yxati
  category: string; // Mahsulot toifasi (masalan: "smart-devices")
  full_description: string;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = params;
  const [activeTab, setActiveTab] = useState("description");
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const axios = useAxios();
  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = await axios({ url: `product/${id}`, method: "GET" });
        setProduct(data.data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <div className="flex items-center text-sm text-slate-500 mb-6 overflow-x-auto whitespace-nowrap pb-2">
            <Link href="/" className="hover:text-orange-500 transition-colors">
              Главная
            </Link>
            <span className="mx-2">/</span>

            <span className="mx-2">/</span>
            <span className="font-medium text-slate-700">{product?.title}</span>
          </div>

          {/* Back Button (Mobile) */}
          <div className="mb-4 md:hidden">
            <Link
              href="/"
              className="flex items-center text-sm text-orange-500 hover:text-orange-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Назад к категории
            </Link>
          </div>

          {/* Product Details */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Images */}
            <div>
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden mb-4">
                <div className="relative h-[300px] sm:h-[400px] md:h-[500px] bg-slate-50">
                  <Badge className="absolute top-4 left-4 z-10 bg-red-500 text-white">
                    {product?.price.discount}
                  </Badge>
                  <Image
                    src={product?.image as string || "/placeholder.svg"}
                    alt={product?.title as string}
                    fill
                    className="object-contain p-8"
                  />
                </div>
              </div>

              {/* Thumbnails */}
             
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {product?.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  <Rate disabled defaultValue={product?.rate} />
                </div>
                <span className="text-sm text-slate-600 font-medium">
                  {product?.rate}
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline space-x-3 mb-6">
                <span className="text-3xl font-bold text-orange-500">
                  {product?.price.current.toLocaleString()} so'm
                </span>
                <span className="text-xl text-slate-400 line-through">
                  {product?.price.old_price.toLocaleString()} so'm
                </span>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  Скидка {product?.price.discount} %
                </Badge>
              </div>

              {/* Short Description */}
              <p className="text-slate-600 mb-6">{product?.description}</p>

              {/* Stock Status */}
              <div className="flex items-center space-x-2 mb-6">
                <div className="flex items-center space-x-2 text-green-600">
                  <Check className="h-5 w-5" />
                  <span>В наличии</span>
                </div>
                <span className="text-sm text-slate-500">
                  • Доставка: 1-3 дня
                </span>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  target="_blank"
                  href={
                    (product?.uzum_link as string) ||
                    "https://uzum.uz/uz/shop/autek"
                  }
                >
                  <Button
                    size="lg"
                    className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    Купить в 1 клик
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 border-2 border-slate-200 hover:border-orange-500 px-8 py-4 rounded-xl font-semibold hover:bg-orange-50 transition-all duration-300 bg-transparent"
                >
                  <Heart className="mr-2 h-5 w-5" />В избранное
                </Button>
              </div>


              {/* Share */}
              <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-500">Поделиться:</span>
                <div className="flex space-x-2">
                  <button onClick={()=> navigator.clipboard.writeText(product?.uzum_link as string)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-orange-100 transition-colors">
                    <Share2 className="h-4 w-4 text-slate-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-16">
            <div className="border-b border-slate-200">
              <div className="flex overflow-x-auto space-x-8">
                {["description", "specifications"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 px-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === tab
                        ? "border-b-2 border-orange-500 text-orange-500"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {tab === "description" ? "Описание" : ""}
                  </button>
                ))}
              </div>
            </div>

            <div className="py-8">
              {activeTab === "description" && (
                <div className="prose max-w-none">
                  <p>{product?.full_description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">
              Похожие товары
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-40 bg-slate-50">
                    <Image
                      src={`https://www.smart.com.kh/_next/image?url=https%3A%2F%2Fsmartaxiata-website-prod-v2.s3.ap-southeast-1.amazonaws.com%2FBlack_i_Phone_16_a75508d0e1.png&w=3840&q=75`}
                      alt={`Похожий товар ${item}`}
                      fill
                      className="object-contain p-4"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-slate-900 line-clamp-1">
                      Xiaomi Redmi Note 12
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">от 19 990 ₽</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
