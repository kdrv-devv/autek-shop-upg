"use client"

import { useState } from "react"
import { Star, Heart, Share2, ShoppingCart, Check, ArrowLeft } from "lucide-react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import Link from "next/link"
import Image from "next/image"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = params
  const [activeTab, setActiveTab] = useState("description")
  const [activeImage, setActiveImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  // Mock product data
  const product = {
    id,
    name: "POCO X5 Pro 5G",
    description:
      "POCO X5 Pro 5G - это мощный смартфон с процессором Snapdragon 778G, 120Гц AMOLED дисплеем и камерой 108 МП. Идеальное сочетание производительности и стиля.",
    price: "24 990 ₽",
    originalPrice: "29 990 ₽",
    discount: "17%",
    rating: 4.8,
    reviews: 127,
    inStock: true,
    images: [
      "https://i04.appmifile.com/826_item_ru/10/07/2023/36ce2c7bd69f5d4e7e128c38e7d66f26!400x400!85.png",
      "https://cdn.ksyru0-fusion.fds.api.mi-img.com/b2c-mishop-pms-ru/pms_1675405371.27892653.png?w=800&h=800&thumb=1",
      "https://m.media-amazon.com/images/I/61R23gA9kAL._UF1000,1000_QL80_.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIon8Eby27RfScGid8qaUM3Uvj-mA0KsOqnQ&s",
    ],
    colors: ["Черный", "Синий", "Зеленый"],
    memory: ["128GB", "256GB"],
    features: [
      "Процессор Snapdragon 778G",
      "120Гц AMOLED дисплей",
      "Камера 108 МП",
      "5000 мАч батарея",
      "67W быстрая зарядка",
      "NFC",
    ],
    specifications: {
      Процессор: "Snapdragon 778G",
      Дисплей: '6.67" AMOLED, 120Гц',
      "Основная камера": "108 МП + 8 МП + 2 МП",
      "Фронтальная камера": "16 МП",
      Батарея: "5000 мАч",
      Зарядка: "67W быстрая зарядка",
      Память: "8GB RAM + 128/256GB ROM",
      "Операционная система": "MIUI 14 на Android 13",
      Вес: "181 г",
      Размеры: "162.1 x 76.1 x 7.9 мм",
    },
  }

  const incrementQuantity = () => setQuantity(quantity + 1)
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
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
            <Link href="/category/smartphones" className="hover:text-orange-500 transition-colors">
              Смартфоны
            </Link>
            <span className="mx-2">/</span>
            <span className="font-medium text-slate-700">{product.name}</span>
          </div>

          {/* Back Button (Mobile) */}
          <div className="mb-4 md:hidden">
            <Link
              href="/category/smartphones"
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
                  <Badge className="absolute top-4 left-4 z-10 bg-red-500 text-white">{product.discount}</Badge>
                  <Image
                    src={product.images[activeImage] || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-contain p-8"
                  />
                </div>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`relative h-20 bg-white rounded-lg border ${
                      activeImage === index ? "border-orange-500" : "border-slate-200"
                    } overflow-hidden`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} - изображение ${index + 1}`}
                      fill
                      className="object-contain p-2"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-slate-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-slate-600 font-medium">
                  {product.rating} ({product.reviews} отзывов)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline space-x-3 mb-6">
                <span className="text-3xl font-bold text-orange-500">{product.price}</span>
                <span className="text-xl text-slate-400 line-through">{product.originalPrice}</span>
                <Badge className="bg-green-100 text-green-800 border-green-200">Скидка {product.discount}</Badge>
              </div>

              {/* Short Description */}
              <p className="text-slate-600 mb-6">{product.description}</p>

              {/* Color Selection */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-700 mb-3">Цвет:</h3>
                <div className="flex space-x-3">
                  {product.colors.map((color, index) => (
                    <button
                      key={color}
                      className={`px-4 py-2 rounded-lg border ${
                        index === 0 ? "border-orange-500 bg-orange-50" : "border-slate-200"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Memory Selection */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-700 mb-3">Память:</h3>
                <div className="flex space-x-3">
                  {product.memory.map((mem, index) => (
                    <button
                      key={mem}
                      className={`px-4 py-2 rounded-lg border ${
                        index === 0 ? "border-orange-500 bg-orange-50" : "border-slate-200"
                      }`}
                    >
                      {mem}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-700 mb-3">Количество:</h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={decrementQuantity}
                    className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100"
                  >
                    -
                  </button>
                  <span className="w-10 text-center">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-2 mb-6">
                <div className="flex items-center space-x-2 text-green-600">
                  <Check className="h-5 w-5" />
                  <span>В наличии</span>
                </div>
                <span className="text-sm text-slate-500">• Доставка: 1-3 дня</span>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <ShoppingCart className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Добавить в корзину
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 border-2 border-slate-200 hover:border-orange-500 px-8 py-4 rounded-xl font-semibold hover:bg-orange-50 transition-all duration-300 bg-transparent"
                >
                  <Heart className="mr-2 h-5 w-5" />В избранное
                </Button>
              </div>

              {/* Features */}
              <div className="bg-slate-50 rounded-xl p-4 mb-8">
                <h3 className="font-medium text-slate-800 mb-3">Основные характеристики:</h3>
                <ul className="space-y-2">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Share */}
              <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-500">Поделиться:</span>
                <div className="flex space-x-2">
                  {["facebook", "twitter", "instagram"].map((social) => (
                    <button
                      key={social}
                      className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-orange-100 transition-colors"
                    >
                      <Share2 className="h-4 w-4 text-slate-600" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-16">
            <div className="border-b border-slate-200">
              <div className="flex overflow-x-auto space-x-8">
                {["description", "specifications", "reviews"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 px-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === tab
                        ? "border-b-2 border-orange-500 text-orange-500"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {tab === "description" ? "Описание" : tab === "specifications" ? "Характеристики" : "Отзывы"}
                  </button>
                ))}
              </div>
            </div>

            <div className="py-8">
              {activeTab === "description" && (
                <div className="prose max-w-none">
                  <p>
                    POCO X5 Pro 5G - это мощный смартфон, который сочетает в себе высокую производительность, стильный
                    дизайн и доступную цену. Благодаря процессору Snapdragon 778G, устройство обеспечивает плавную
                    работу даже в самых требовательных приложениях и играх.
                  </p>
                  <p className="mt-4">
                    6.67-дюймовый AMOLED дисплей с частотой обновления 120 Гц обеспечивает яркие цвета и плавную
                    анимацию, делая использование смартфона комфортным в любых условиях. Основная камера на 108 МП
                    позволяет делать детализированные фотографии даже при слабом освещении.
                  </p>
                  <p className="mt-4">
                    Батарея емкостью 5000 мАч обеспечивает длительное время работы, а технология быстрой зарядки
                    мощностью 67 Вт позволяет зарядить устройство до 50% всего за 15 минут.
                  </p>
                </div>
              )}

              {activeTab === "specifications" && (
                <div className="grid md:grid-cols-2 gap-8">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="border-b border-slate-100 pb-4">
                      <div className="flex justify-between">
                        <span className="text-slate-500">{key}</span>
                        <span className="font-medium text-slate-900">{value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "reviews" && (
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">Отзывы клиентов</h3>
                      <p className="text-slate-600">
                        {product.reviews} отзывов со средней оценкой {product.rating} из 5
                      </p>
                    </div>
                    <Button>Написать отзыв</Button>
                  </div>

                  <div className="space-y-6">
                    {[
                      {
                        name: "Алексей П.",
                        rating: 5,
                        date: "15.03.2024",
                        comment:
                          "Отличный смартфон за свои деньги! Быстрый, с хорошей камерой и долгой автономностью. Рекомендую!",
                      },
                      {
                        name: "Мария С.",
                        rating: 4,
                        date: "02.03.2024",
                        comment:
                          "В целом доволен покупкой. Единственный минус - немного нагревается при длительных играх.",
                      },
                    ].map((review, index) => (
                      <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-medium text-slate-900">{review.name}</h4>
                            <div className="flex items-center mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating ? "text-yellow-400 fill-current" : "text-slate-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-slate-500">{review.date}</span>
                        </div>
                        <p className="text-slate-600">{review.comment}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 text-center">
                    <Button variant="outline">Показать больше отзывов</Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Похожие товары</h2>
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
                    <h3 className="font-medium text-slate-900 line-clamp-1">Xiaomi Redmi Note 12</h3>
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
  )
}
