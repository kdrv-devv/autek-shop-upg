"use client"

import { useState } from "react"
import { PopularProductsSection } from "@/components/admin/PopularProductsSection"
import { AdminLayout } from "@/components/admin/AdminLayout"
import { ShowcaseSection } from "@/components/admin/ShowcaseSection"
import { CategorySection } from "@/components/admin/CategorySection"
import { ProductsSection } from "@/components/admin/ProductsSection"

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("showcase")

  const renderSection = () => {
    switch (activeSection) {
      case "showcase":
        return <ShowcaseSection />
      case "category":
        return <CategorySection />
      case "popular-products":
        return <PopularProductsSection />
      case "products":
        return <ProductsSection />
      default:
        return <ShowcaseSection />
    }
  }

  return (
    <AdminLayout activeSection={activeSection} setActiveSection={setActiveSection}>
      {renderSection()}
    </AdminLayout>
  )
}
