"use client";

import { useEffect, useState } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    price: 0,
  });

  async function fetchProducts() {
    const res = await fetch("/api/admin/products");
    setProducts(await res.json());
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  async function createProduct() {
    await fetch("/api/admin/products", {
      method: "POST",
      body: JSON.stringify(form),
    });

    setForm({ name: "", slug: "", price: 0 });
    fetchProducts();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Products 🚀</h1>

      <div className="flex gap-2 mb-6">
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />
        <input
          placeholder="Slug (lead-finder)"
          value={form.slug}
          onChange={(e) =>
            setForm({ ...form, slug: e.target.value })
          }
        />
        <input
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: Number(e.target.value) })
          }
        />

        <button onClick={createProduct} className="bg-black text-white px-4">
          Add
        </button>
      </div>

      {products.map((p) => (
        <div key={p.id} className="border p-2">
          {p.name} → /{p.slug}
        </div>
      ))}
    </div>
  );
}