"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, ImageIcon, Save, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/Badge";
import Image from "next/image";
import { toast } from "react-toastify";
import { useAxios } from "@/hooks/useAxios";

interface ShowcaseData {
  id: number;
  main_text: string;
  tag_line: string;
  price: {
    current: number;
    old: number;
    discount: number;
  };
  image: string;
  uzum_link: string;
}

export function ShowcaseSection() {
  const axios = useAxios();
  const [loading, setLoading] = useState<boolean>(true);
  const [showcaseData, setShowcaseData] = useState<ShowcaseData>({
    id: 1,
    main_text: "",
    tag_line: "",
    price: {
      current: 0,
      old: 0,
      discount: 0,
    },
    image: "/placeholder.svg?height=400&width=400",
    uzum_link: "https://uzum.uz/uz/shop/autek",
  });

  const getOldShowcase = async () => {
    let data = await axios({ url: "showcase", method: "GET" });
    setShowcaseData(data?.data[0]);
    setLoading(false);
  };

  useEffect(() => {
    getOldShowcase();
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<ShowcaseData>(showcaseData);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();

      formData.append("id", editData.id.toString());
      formData.append("main_text", editData.main_text);
      formData.append("tag_line", editData.tag_line);
      formData.append("current", editData.price.current.toString());
      formData.append("old", editData.price.old.toString());
      formData.append("discount", editData.price.discount.toString());
      formData.append("uzum_link", editData.uzum_link);

      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const response = await fetch("https://autek-shop-upg.vercel.app/showcase", {
        method: "PUT",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Xatolik yuz berdi");
      }

      setShowcaseData({
        ...editData,
        image: imagePreview || editData.image,
      });
      setIsEditing(false);
      setSelectedImage(null);
      setImagePreview("");
      toast.success("Showcase muvaffaqiyatli yangilandi");
    } catch (error) {
      console.error("Xatolik:", error);
      toast.error("Xatolik yuz berdi");
    }
  };

  const handleCancel = () => {
    setEditData(showcaseData);
    setIsEditing(false);
    setSelectedImage(null);
    setImagePreview("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Showcase Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage your main showcase content
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {isEditing && !loading ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="bg-transparent"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-green-500 to-green-600"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button
              onClick={() => {
                setEditData(showcaseData)
                setIsEditing(true)}}
              className="bg-gradient-to-r from-orange-500 to-orange-600"
            >
              Edit Showcase
            </Button>
          )}
        </div>
      </div>

      {/* Showcase Preview */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-8"
        >
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
            Current Showcase
          </h2>

          <div className="space-y-6">
            <div className="relative h-64 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-xl overflow-hidden">
              <Image
                src={showcaseData.image || "/placeholder.svg"}
                alt={showcaseData.main_text}
                fill
                className="object-contain p-4"
              />
              <Badge className="absolute top-3 left-3 bg-red-500 text-white">
                -{showcaseData?.price?.discount}%
              </Badge>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {showcaseData.main_text}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  {showcaseData.tag_line}
                </p>
              </div>

              <div className="flex items-baseline space-x-3">
                <span className="text-2xl font-bold text-orange-500">
                  {showcaseData.price.current.toLocaleString()} so'm
                </span>
                <span className="text-lg text-slate-400 line-through">
                  {showcaseData?.price?.old.toLocaleString()} so'm
                </span>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Save{" "}
                  {(
                    showcaseData.price.old - showcaseData.price.current
                  ).toLocaleString()}{" "}
                  so'm
                </Badge>
              </div>

              {/* Uzum link preview */}
              {showcaseData.uzum_link && (
                <a
                  href={showcaseData.uzum_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline text-sm"
                >
                  View on Uzum
                </a>
              )}
            </div>
          </div>
        </motion.div>

        {/* Edit Form */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-8"
          >
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
              Edit Showcase
            </h2>

            <div className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Product Image
                </label>
                <div className="space-y-4">
                  <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-xl overflow-hidden border-2 border-dashed border-slate-300 dark:border-slate-600">
                    {imagePreview || editData.image ? (
                      <Image
                        src={imagePreview || editData.image}
                        alt="Preview"
                        fill
                        className="object-contain p-4"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <ImageIcon className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                          <p className="text-slate-500 dark:text-slate-400">
                            No image selected
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-center">
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-transparent border-2 border-dashed border-orange-300 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-300"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {selectedImage ? "Change Image" : "Upload Image"}
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Main Text */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Main Text
                </label>
                <Input
                  value={editData.main_text}
                  onChange={(e) =>
                    setEditData({ ...editData, main_text: e.target.value })
                  }
                  placeholder="Enter main text"
                  className="bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm"
                />
              </div>

              {/* Tag Line */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Tag Line
                </label>
                <Input
                  value={editData.tag_line}
                  onChange={(e) =>
                    setEditData({ ...editData, tag_line: e.target.value })
                  }
                  placeholder="Enter tag line"
                  className="bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm"
                />
              </div>

              {/* Uzum Link */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Uzum Link
                </label>
                <Input
                  value={editData.uzum_link}
                  onChange={(e) =>
                    setEditData({ ...editData, uzum_link: e.target.value })
                  }
                  placeholder="https://uzum.uz/product/..."
                  className="bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm"
                />
              </div>

              {/* Price Section */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Current Price
                  </label>
                  <Input
                    type="number"
                    value={editData.price.current}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        price: {
                          ...editData.price,
                          current: Number(e.target.value),
                        },
                      })
                    }
                    placeholder="Current price"
                    className="bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Old Price
                  </label>
                  <Input
                    type="number"
                    value={editData.price.old}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        price: {
                          ...editData.price,
                          old: Number(e.target.value),
                        },
                      })
                    }
                    placeholder="Old price"
                    className="bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Discount %
                  </label>
                  <Input
                    type="number"
                    value={editData.price.discount}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        price: {
                          ...editData.price,
                          discount: Number(e.target.value),
                        },
                      })
                    }
                    placeholder="Discount percentage"
                    className="bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm"
                  />
                </div>
              </div>

              {/* Price Preview */}
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Price Preview:
                </h4>
                <div className="flex items-baseline space-x-3">
                  <span className="text-xl font-bold text-orange-500">
                    {editData.price.current.toLocaleString()} so'm
                  </span>
                  <span className="text-sm text-slate-400 line-through">
                    {editData.price.old.toLocaleString()} so'm
                  </span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    -{editData.price.discount}%
                  </Badge>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
