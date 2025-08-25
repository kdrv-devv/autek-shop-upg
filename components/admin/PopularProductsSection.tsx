"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Upload,
  X,
  Save,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/Badge";
import Image from "next/image";
import { useAxios } from "@/hooks/useAxios";
import { toast } from "react-toastify";
import { Rate } from "antd";

interface PopularProduct {
  id: number;
  title: string;
  rate: number;
  price: number
  description: string;
  uzum_link: string;
  image: string;
}

export function PopularProductsSection() {
  const axios = useAxios();
  const [products, setProducts] = useState<PopularProduct[]>([]); // Start with an empty array
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<PopularProduct | null>(null);
  const [formData, setFormData] = useState<Omit<PopularProduct, "id">>({
    title: "",
    rate: 0,
    price: 0,
    description: "",
    uzum_link: "",
    image: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  // Fetch all products (GET Request)
  const getAllPopularProduct = async () => {
    try {
      const response = await axios({ url: "popular-prod", method: "GET" });
      
      setProducts(response?.data || []); // Ensure products is always an array
    } catch (error) {
      toast.error("Failed to fetch products");
      setProducts([]); // In case of error, set products as an empty array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllPopularProduct(); // Initial load
  }, []);

  // Handle image selection for upload
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

  // Handle form submit (POST and PUT Request)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("rate", String(formData.rate));
    formDataToSend.append("price", String(formData.price));

    if (selectedImage) {
      formDataToSend.append("image", selectedImage);
    }

    try {
      if (editingProduct) {
        // Update product (PUT Request)
        formDataToSend.append("id", String(editingProduct.id));
        await axios({
          url: "popular-prod",
          method: "PUT",
          body: formDataToSend, // Correcting from 'body' to 'data'
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product updated");
      } else {
        // Add new product (POST Request)
        await axios({
          url: "popular-prod",
          method: "POST",
          body: formDataToSend, // Correcting from 'body' to 'data'
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product added");
      }
      getAllPopularProduct(); // Refresh product list
      closeModal(); // Close modal
    } catch (error: any) {
      toast.error(`Error: ${error?.message}`);
    }
  };

  // Edit a product (Populate form with current product data)
  const handleEdit = (product: PopularProduct) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      rate: product.rate,
      price: product.price,
      description: product.description,
      uzum_link: product.uzum_link,
      image: product.image,
    });
    setImagePreview(product.image);
    setIsModalOpen(true);
  };

  // Delete a product (DELETE Request)
  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await axios({
          url: `popular-prod?id=${id}`,
          method: "DELETE",
        });
        toast.success("Product deleted");
        getAllPopularProduct(); // Refresh product list
      } catch (error) {
        toast.error("Error deleting product");
      }
    }
  };

  // Close modal and reset state
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({
      title: "",
      rate: 0,
      price: 0,
      description: "",
      uzum_link: "",
      image: "",
    });
    setSelectedImage(null);
    setImagePreview("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Popular Products</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Manage featured popular products</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-gradient-to-r from-orange-500 to-orange-600">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div>Loading...</div>
        ) : (
          // Ensure that products is always an array before calling .map()
          Array.isArray(products) && products.length > 0 ? (
            products.map((product: PopularProduct) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800">
                  <Badge className="absolute top-3 left-3 bg-red-500 text-white z-10">
                    -{product.price - 100} %
                  </Badge>
                  <Image src={product.image || "/placeholder.svg"} alt={product.title} fill className="object-contain p-4" />
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center">
                      <Rate disabled defaultValue={product.rate} />
                    </div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">{product.rate}</span>
                  </div>

                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{product.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">{product.description}</p>

                  <div className="flex items-baseline space-x-2 mb-4">
                    <span className="text-lg font-bold text-orange-500">{String(product?.price).toLocaleString()} so'm</span>
                    <span className="text-sm text-slate-400 line-through">{String((product?.price + 10000)).toLocaleString()} so'm</span>
                  </div>

                  {/* Uzum Link */}
                  {product.uzum_link && (
                    <a
                      href={product.uzum_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-blue-500 hover:text-blue-600 mb-4"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View on Uzum
                    </a>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(product)} className="flex-1 bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/20">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(product.id)} className="flex-1 bg-transparent hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div>No products found</div>
          )
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <div className="w-full max-w-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 pointer-events-auto max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
                    <Button variant="ghost" size="icon" onClick={closeModal}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Product Image</label>
                      <div className="space-y-4">
                        <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-xl overflow-hidden border-2 border-dashed border-slate-300 dark:border-slate-600">
                          {imagePreview ? (
                            <Image src={imagePreview || "/placeholder.svg"} alt="Preview" fill className="object-contain p-4" />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <div className="text-center">
                                <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                                <p className="text-sm text-slate-500 dark:text-slate-400">Upload image</p>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex justify-center">
                          <Button type="button" variant="outline" onClick={() => document.getElementById("product-image")?.click()} className="bg-transparent border-2 border-dashed border-orange-300 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-300">
                            <Upload className="h-4 w-4 mr-2" />
                            Choose Image
                          </Button>
                          <input id="product-image" type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                        </div>
                      </div>
                    </div>

                    {/* Title and Rating */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Product Title</label>
                        <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Enter product title" required className="bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Rating</label>
                        <Input type="number" min="0" max="5" step="0.1" value={formData.rate} onChange={(e) => setFormData({ ...formData, rate: Number(e.target.value) })} placeholder="4.5" required className="bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm" />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description</label>
                      <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Enter product description" rows={3} required className="w-full px-3 py-2 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm border border-input rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                    </div>

                    {/* Price Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Current Price</label>
                        <Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price:+e.target.value  })} placeholder="24990" required className="bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm" />
                      </div>
                     
                    </div>

                    {/* Uzum Link */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Uzum Link (Optional)</label>
                      <Input type="url" value={formData.uzum_link} onChange={(e) => setFormData({ ...formData, uzum_link: e.target.value })} placeholder="https://uzum.uz/product/..." className="bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm" />
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3 pt-4">
                      <Button type="button" variant="outline" onClick={closeModal} className="flex-1 bg-transparent">
                        Cancel
                      </Button>
                      <Button type="submit" className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600">
                        <Save className="h-4 w-4 mr-2" />
                        {editingProduct ? "Update" : "Create"}
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
