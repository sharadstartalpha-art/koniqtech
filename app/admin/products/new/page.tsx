"use client"

import { useState } from "react"

export default function NewProduct() {
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")

  const handleCreate = async () => {
    await fetch("/api/admin/products", {
      method: "POST",
      body: JSON.stringify({ name, slug }),
    })

    window.location.href = "/admin/products"
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Create Product</h1>

      <input
        placeholder="Name"
        className="border p-2 mb-2 w-full"
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Slug"
        className="border p-2 mb-4 w-full"
        onChange={(e) => setSlug(e.target.value)}
      />

      <button
        onClick={handleCreate}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Create
      </button>
    </div>
  )
}