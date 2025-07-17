export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating: number
  reviews: number
  inStock: boolean
  features: string[]
  specifications: Record<string, string>
}

export interface Category {
  id: string
  name: string
  icon: string
  slug: string
  productCount: number
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  preferences: {
    theme: "light" | "dark"
    language: string
    currency: string
  }
}

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

export interface SearchSuggestion {
  id: string
  text: string
  type: "product" | "category" | "brand"
  popularity: number
}
