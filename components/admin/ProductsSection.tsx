"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Edit, Trash2, Upload, X, Save, Search } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/Badge"
import Image from "next/image"

interface Product {
  id: number
  title: string
  category: string
  price: {
    current: number
    old: number
    discount: number
  }
  description: string
  stock: number
  status: "active" | "inactive"
  image: string
}

export function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      title: "iPhone 15 Pro Max",
      category: "Smartphones",
      price: { current: 89990, old: 99990, discount: 10 },
      description: "Latest iPhone with A17 Pro chip",
      stock: 25,
      status: "active",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      title: "MacBook Air M3",
      category: "Laptops",
      price: { current: 129990, old: 149990, discount: 13 },
      description: "Powerful laptop with M3 chip",
      stock: 15,
      status: "active",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 3,
      title: "iPad Pro 12.9",
      category: "Tablets",
      price: { current: 79990, old: 89990, discount: 11 },
      description: "Professional tablet for creative work",
      stock: 0,
      status: "inactive",
      image: "/placeholder.svg?height=100&width=100",
    },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [formData, setFormData] = useState<Omit<Product, "id">>({
    title: "",
    category: "",
    price: { current: 0, old: 0, discount: 0 },
    description: "",
    stock: 0,
    status: "active",
    image: "",
  })
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState("")

  const categories = ["all", "Smartphones", "Laptops", "Tablets", "Accessories"]

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const formDataToSend = new FormData()
      if (selectedImage) {
        formDataToSend.append("image", selectedImage)
      }
      formDataToSend.append("data", JSON.stringify(formData))

      if (editingProduct) {
        const updatedProducts = products.map((product) =>
          product.id === editingProduct.id
            ? { ...formData, id: editingProduct.id, image: imagePreview || product.image }
            : product,
        )
        setProducts(updatedProducts)
      } else {
        const newProduct: Product = {
          ...formData,
          id: Date.now(),
          image: imagePreview || "/placeholder.svg?height=100&width=100",
        }
        setProducts([...products, newProduct])
      }

      closeModal()
    } catch (error) {
      console.error("Error saving product:", error)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      title: product.title,
      category: product.category,
      price: product.price,
      description: product.description,
      stock: product.stock,
      status: product.status,
      image: product.image,
    })
    setImagePreview(product.image)
    setIsModalOpen(true)
  }

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((product) => product.id !== id))
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
    setFormData({
      title: "",
      category: "",
      price: { current: 0, old: 0, discount: 0 },
      description: "",
      stock: 0,
      status: "active",
      image: "",
    })
    setSelectedImage(null)
    setImagePreview("")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Products Management</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Manage all products in your store</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-gradient-to-r from-orange-500 to-orange-600">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="pl-10 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm border border-input rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products List */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
            Products List ({filteredProducts.length})
          </h2>

          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200/50 dark:border-slate-600/50"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative w-16 h-16 bg-white dark:bg-slate-600 rounded-lg overflow-hidden">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.title}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white">{product.title}</h3>
                      <Badge
                        className={
                          product.status === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }
                      >
                        {product.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{product.category}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-1">{product.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-baseline space-x-2 mb-1">
                      <span className="text-lg font-bold text-orange-500">
                        {product.price.current.toLocaleString()} ₽
                      </span>
                      <span className="text-sm text-slate-400 line-through">
                        {product.price.old.toLocaleString()} ₽
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Stock: {product.stock} units</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(product)}
                    className="bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-200 dark:border-blue-700"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                    className="bg-transparent hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-700 text-red-600 dark:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-500 dark:text-slate-400">No products found</p>
              </div>
            )}
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
              <div className="w-full max-w-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 pointer-events-auto max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                      {editingProduct ? "Edit Product" : "Add New Product"}
                    </h2>
                    <Button variant="ghost" size="icon" onClick={closeModal}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                        Product Image
                      </label>
                      <div className="space-y-4">
                        <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-xl overflow-hidden border-2 border-dashed border-slate-300 dark:border-slate-600">
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
                                <p className="text-sm text-slate-500 dark:text-slate-400">Upload image</p>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex justify-center">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById("product-image-full")?.click()}
                            className="bg-transparent border-2 border-dashed border-orange-300 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-300"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Choose Image
                          </Button>
                          <input
                            id="product-image-full"
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Title and Category */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Product Title
                        </label>
                        <Input
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Enter product title"
                          required
                          className="bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Category
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          required
                          className="w-full px-3 py-2 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm border border-input rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <option value="">Select category</option>
                          {categories.slice(1).map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Enter product description"
                        rows={3}
                        required
                        className="w-full px-3 py-2 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm border border-input rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                    </div>

                    {/* Price Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Current Price
                        </label>
                        <Input
                          type="number"
                          value={formData.price.current}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              price: { ...formData.price, current: Number(e.target.value) },
                            })
                          }
                          placeholder="89990"
                          required
                          className="bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Old Price
                        </label>
                        <Input
                          type="number"
                          value={formData.price.old}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              price: { ...formData.price, old: Number(e.target.value) },
                            })
                          }
                          placeholder="99990"
                          required
                          className="bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Discount %
                        </label>
                        <Input
                          type="number"
                          value={formData.price.discount}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              price: { ...formData.price, discount: Number(e.target.value) },
                            })
                          }
                          placeholder="10"
                          required
                          className="bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm"
                        />
                      </div>
                    </div>

                    {/* Stock and Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Stock Quantity
                        </label>
                        <Input
                          type="number"
                          min="0"
                          value={formData.stock}
                          onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                          placeholder="25"
                          required
                          className="bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Status
                        </label>
                        <select
                          value={formData.status}
                          onChange={(e) =>
                            setFormData({ ...formData, status: e.target.value as "active" | "inactive" })
                          }
                          className="w-full px-3 py-2 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm border border-input rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
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
  )
}
