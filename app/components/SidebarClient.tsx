"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Bot,
  Users,
  Zap,
} from "lucide-react"

type Product = {
  id: string
  name: string
  slug: string
}

export default function SidebarClient({
  products,
}: {
  products: Product[]
}) {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  // 🔥 map icons to products
  const getIcon = (slug: string) => {
    switch (slug) {
      case "meeting-ai":
        return <Bot size={16} />
      case "lead-finder":
        return <Users size={16} />
      case "automation-tool":
        return <Zap size={16} />
      default:
        return <Zap size={16} />
    }
  }

  return (
    <div className="w-60 bg-black text-white p-4 min-h-screen">
      <h1 className="text-xl font-bold mb-6">KoniqTech</h1>

      {/* Dashboard */}
      <Link
        href="/dashboard"
        className={`flex items-center gap-2 px-2 py-2 rounded ${
          isActive("/dashboard")
            ? "bg-white text-black"
            : "text-gray-400 hover:text-white"
        }`}
      >
        <LayoutDashboard size={16} />
        Dashboard
      </Link>

      {/* Products */}
      <p className="text-gray-500 mt-6 mb-2 text-sm">Products</p>

      {products.map((product) => (
        <Link
          key={product.id}
          href={`/product/${product.slug}`}
          className={`flex items-center gap-2 px-2 py-2 rounded ${
            isActive(`/product/${product.slug}`)
              ? "bg-white text-black"
              : "text-gray-400 hover:text-white"
          }`}
        >
          {getIcon(product.slug)}
          {product.name}
        </Link>
      ))}
    </div>
  )
}