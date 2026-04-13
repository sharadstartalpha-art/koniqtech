"use client";

import { useState } from "react";

export default function ProductsPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("");

  async function createProduct() {
    await fetch("/api/admin/products", {
      method: "POST",
      body: JSON.stringify({
        name,
        slug,
        price: Number(price),
      }),
    });

    alert("Product created!");
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Products 🚀</h1>

      <input
        placeholder="Name"
        className="border p-2 block mb-2"
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Slug (test-1)"
        className="border p-2 block mb-2"
        onChange={(e) => setSlug(e.target.value)}
      />

      <input
        placeholder="Price"
        className="border p-2 block mb-2"
        onChange={(e) => setPrice(e.target.value)}
      />

      <button
        onClick={createProduct}
        className="bg-black text-white px-4 py-2"
      >
        Create Product
      </button>
    </div>
  );
}