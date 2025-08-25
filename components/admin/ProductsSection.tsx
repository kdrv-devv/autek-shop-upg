"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Edit, Trash2, Upload, X, Save, Search } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { toast } from "react-toastify"
import { useAxios } from "@/hooks/useAxios"

interface Product {
  id: number
  title: string
  category: string
  rate: number
  price: {
    current: number
    old_price: number
    discount: number
  }
  description: string
  full_description: string
  uzum_link: string
  image: string
}

interface Category {
  id: number
  title: string
  image: string
}

export function ProductsSection() {
  const axios = useAxios()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const [formData, setFormData] = useState<Omit<Product, "id">>({
    title: "",
    category: "",
    rate: 0,
    price: { current: 0, old_price: 0, discount: 0 },
    description: "",
    full_description: "",
    uzum_link: "",
    image: "",
  })

  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState("")

  // Fetch products
  const getProducts = async () => {
    try {
      const res = await axios({ url: "product", method: "GET" })
      setProducts(res.data)
    } catch (error) {
      toast.error("Failed to fetch products")
    } finally {
      setLoading(false)
    }
  }

  // Fetch categories
  const getCategories = async () => {
    try {
      const res = await axios({ url: "category", method: "GET" })
      setCategories(res.data)
    } catch (error) {
      toast.error("Failed to fetch categories")
    }
  }

  useEffect(() => {
    getProducts()
    getCategories()
  }, [])

  // Filter
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Image select
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

  // Save Product
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("title", formData.title)
      formDataToSend.append("category", formData.category)
      formDataToSend.append("rate", String(formData.rate))
      formDataToSend.append("current", String(formData.price.current))
      formDataToSend.append("old_price", String(formData.price.old_price))
      formDataToSend.append("discount", String(formData.price.discount))
      formDataToSend.append("description", formData.description)
      formDataToSend.append("full_description", formData.full_description)
      formDataToSend.append("uzum_link", formData.uzum_link)

      if (selectedImage) {
        formDataToSend.append("image", selectedImage)
      }

      if (editingProduct) {
        await axios({
          url: `product/${editingProduct.id}`,
          method: "PUT",
          body: formDataToSend,
          headers: { "Content-Type": "multipart/form-data" },
        })
        toast.success("Product updated")
      } else {
        await axios({
          url: "product",
          method: "POST",
          body: formDataToSend,
          headers: { "Content-Type": "multipart/form-data" },
        })
        toast.success("Product added")
      }

      getProducts()
      closeModal()
    } catch (error) {
      console.error(error)
      toast.error("Error saving product")
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      title: product.title,
      category: product.category,
      rate: product.rate,
      price: product.price,
      description: product.description,
      full_description: product.full_description,
      uzum_link: product.uzum_link,
      image: product.image,
    })
    setImagePreview(product.image)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await axios({ url: `product/${id}`, method: "DELETE" })
        toast.success("Product deleted")
        getProducts()
      } catch (error) {
        toast.error("Error deleting product")
      }
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
    setFormData({
      title: "",
      category: "",
      rate: 0,
      price: { current: 0, old_price: 0, discount: 0 },
      description: "",
      full_description: "",
      uzum_link: "",
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
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-orange-500 to-orange-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white/80 dark:bg-slate-800/80 p-6 rounded-2xl shadow-xl">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="pl-10 bg-white/50 dark:bg-slate-700/50"
            />
          </div>
          <div className="md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-white/50 dark:bg-slate-700/50 border rounded-md"
            >
              <option value="all">All Categories</option>
              {categories?.map((category) => (
                <option key={category.id} value={category.title}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products List */}
      <div className="bg-white/80 dark:bg-slate-800/80 rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-semibold mb-6">Products List ({filteredProducts.length})</h2>
        <div className="space-y-4">
          {loading ? (
            <p>Loading...</p>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative w-16 h-16">
                    <Image src={product.image} alt={product.title} fill className="object-contain p-2" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{product.title}</h3>
                    <p className="text-sm text-slate-500">{product.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-orange-500">{product.price.current.toLocaleString()} so'm</span>
                  <span className="text-sm line-through ml-2">{product.price.old_price.toLocaleString()} so'm</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(product)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(product.id)} className="text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))
          ) : (
            <p>No products found</p>
          )}
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
                            <Image src={imagePreview} alt="Preview" fill className="object-contain p-4" />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <Upload className="h-8 w-8 text-slate-400" />
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

                    {/* Title */}
                    <Input
                      placeholder="Title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      className="bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm"
                    />

                    {/* Category */}
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm border rounded-md"
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.title}>
                          {cat.title}
                        </option>
                      ))}
                    </select>

                    {/* Rate */}
                    <Input
                      type="number"
                      placeholder="Rate (e.g. 4.5)"
                      value={formData.rate}
                      onChange={(e) => setFormData({ ...formData, rate: Number(e.target.value) })}
                      required
                      className="bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm"
                    />

                    {/* Description */}
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Short Description"
                      rows={3}
                      className="w-full px-3 py-2 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm border rounded-md"
                    />

                    {/* Full Description */}
                    <textarea
                      value={formData.full_description}
                      onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                      placeholder="Full Description"
                      rows={5}
                      className="w-full px-3 py-2 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm border rounded-md"
                    />

                    {/* Uzum Link */}
                    <Input
                      type="url"
                      placeholder="Uzum Link"
                      value={formData.uzum_link}
                      onChange={(e) => setFormData({ ...formData, uzum_link: e.target.value })}
                      className="bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm"
                    />

                    {/* Price */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        type="number"
                        placeholder="Current Price"
                        value={formData.price.current}
                        onChange={(e) => setFormData({ ...formData, price: { ...formData.price, current: Number(e.target.value) } })}
                        className="bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm"
                      />
                      <Input
                        type="number"
                        placeholder="Old Price"
                        value={formData.price.old_price}
                        onChange={(e) => setFormData({ ...formData, price: { ...formData.price, old_price: Number(e.target.value) } })}
                        className="bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm"
                      />
                      <Input
                        type="number"
                        placeholder="Discount %"
                        value={formData.price.discount}
                        onChange={(e) => setFormData({ ...formData, price: { ...formData.price, discount: Number(e.target.value) } })}
                        className="bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm"
                      />
                    </div>

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
