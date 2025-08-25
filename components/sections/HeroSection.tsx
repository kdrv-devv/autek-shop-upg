"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProductCard3D } from "@/components/ui/ProductCard3D";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAxios } from "@/hooks/useAxios";

interface Price {
  current: number;
  old: number;
  discount: number;
}

interface ShowcaseDataType {
  id: number;
  image: string;
  main_text: string;
  price: Price;
  tag_line: string;
  uzum_link:string
}

export function HeroSection() {
  const axios = useAxios();
  const [data, setData] = useState<ShowcaseDataType>();
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUiData = async () => {
    const data = await axios({ url: "showcase", method: "GET" });
    setLoading(false);
    setData(data?.data[0]);
  };

  useEffect(() => {
    fetchUiData();
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden ">
      <ParticleBackground />

      <div className="container mx-auto px-4 pt-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 sm:space-y-8 order-2 lg:order-1"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Badge className=" mt-10 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Новинка 2025
              </Badge>
            </motion.div>

            {/* Title */}
            <div className="space-y-3 sm:space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl  w-full font-bold  leading-tight break-words"
              >
                <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                  {data?.main_text.split(" ")[0]}
                </span>
                <br />
                <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                  {data?.main_text.split(" ").slice(1).join(" ")}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-lg leading-relaxed"
              >
                {data?.tag_line}
              </motion.p>
            </div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-2 sm:gap-4"
            >
              {["10000 mА/s"].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-1 sm:space-x-2 bg-white/50 backdrop-blur-sm rounded-full px-2 sm:px-4 py-1 sm:py-2 border border-slate-200"
                >
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
                  <span className="text-xs sm:text-sm font-medium text-slate-700">
                    {feature}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Price */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row sm:items-baseline space-y-2 sm:space-y-0 sm:space-x-4"
            >
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                {data?.price.current.toLocaleString('en-US')} so'm
              </span>
              <span className="text-lg sm:text-xl lg:text-2xl text-slate-400 line-through">
                {data?.price.old.toLocaleString('en-US')} so'm
              </span>
              <Badge className="bg-green-100 text-green-800 border-green-200 w-fit">
                {data?.price.discount}%
              </Badge>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full"
            >
              <Link target="_blank" href={data?.uzum_link as string || "https://uzum.uz/uz/shop/autek" }>
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  Купить сейчас
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Button
                onClick={() => window.location.href ="https://uzum.uz/uz/product/simli-simsiz-akkumulyator-1737463?skuId=5971101"}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-2 border-slate-300 hover:border-orange-500 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold bg-white/50 backdrop-blur-sm hover:bg-orange-50 transition-all duration-300 group"
              >
                <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" />
                Посетите магазин
              </Button>
            </motion.div>
          </motion.div>

          {/* 3D Product */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative order-1 lg:order-2 mx-auto w-full max-w-[350px] lg:max-w-none"
          >
            <ProductCard3D
              loading={loading}
              title={data?.main_text}
              img={data?.image}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
