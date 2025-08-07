"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, Upload, X, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useAxios } from "@/hooks/useAxios";
import { toast } from "react-toastify";

interface Category {
  id: number;
  title: string;
  image: string;
}

export function CategorySection() {
  const axios = useAxios()
  const [categories, setCategories] = useState<Category[] >([]);

  const getAllCategory = async () => {
    let data = await axios({url:"category" , method:"GET"})
    console.log(data.data)
    setCategories(data.data)

  }
  useEffect(()=>{
    getAllCategory()
  },[])


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ title: "", image: "" });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

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

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const formDataToSend = new FormData();
    if (selectedImage) {
      formDataToSend.append("image", selectedImage);
    }
    formDataToSend.append("title", formData.title);

    // Agar edit rejimida bo‘lsa PUT so‘rov yuboramiz
    if (editingCategory) {
      formDataToSend.append("id", editingCategory.id.toString());

      const res = await axios({
        url: "category",
        method: "PUT",
        body: formDataToSend,
        headers: { "Content-Type": "multipart/form-data" },
      });

      
      const updated = res.data;
      setCategories((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );
      toast.success("Category muofaqqiyatli yangilandi.")
    } else {
      // Yangi category POST
      const res = await axios({
        url: "category/upload",
        method: "POST",
        body: formDataToSend,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCategories([...categories, res.data]);
        toast.success("Yangi category muofaqqiyatli qo'shildi")
    }

    // reset
    setFormData({ title: "", image: "" });
    setSelectedImage(null);
    setImagePreview("");
    setIsModalOpen(false);
    setEditingCategory(null);
  } catch (error) {
    console.error("Error saving category:", error);
  }
};


  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ title: category.title, image: category.image });
    setImagePreview(category.image);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      axios({url:`category?id=${id}` , method:"DELETE"})
      setCategories(categories.filter((cat) => cat.id !== id));
    }
  };


  
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ title: "", image: "" });
    setSelectedImage(null);
    setImagePreview("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Category Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage product categories
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-orange-500 to-orange-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Categories List */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
            Categories List
          </h2>

          <div className="space-y-4">
            {categories.map((category) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200/50 dark:border-slate-600/50"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative w-16 h-16 bg-white dark:bg-slate-600 rounded-lg overflow-hidden">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.title}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {category.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      ID: {category.id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(category)}
                    className="bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-200 dark:border-blue-700"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(category.id)}
                    className="bg-transparent hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-700 text-red-600 dark:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="w-full max-w-md bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 pointer-events-auto max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                      {editingCategory ? "Edit Category" : "Add New Category"}
                    </h2>
                    <Button variant="ghost" size="icon" onClick={closeModal}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                        Category Image
                      </label>
                      <div className="space-y-4">
                        <div className="relative h-32 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-xl overflow-hidden border-2 border-dashed border-slate-300 dark:border-slate-600">
                          {imagePreview ? (
                            <Image
                              src={imagePreview || "/placeholder.svg"}
                              alt="Preview"
                              fill
                              className="object-contain p-4"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <div className="text-center">
                                <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                  Upload image
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex justify-center">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              document.getElementById("category-image")?.click()
                            }
                            className="bg-transparent border-2 border-dashed border-orange-300 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-300"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Choose Image
                          </Button>
                          <input
                            id="category-image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Category Title
                      </label>
                      <Input
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        placeholder="Enter category title"
                        required
                        className="bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={closeModal}
                        className="flex-1 bg-transparent"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {editingCategory ? "Update" : "Create"}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
