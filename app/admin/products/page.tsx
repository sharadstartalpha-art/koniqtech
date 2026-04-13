"use client";

import { useEffect, useState } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  async function load() {
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function deleteProduct(id: string) {
    if (!confirm("Delete product?")) return;

    await fetch("/api/admin/products/delete", {
      method: "POST",
      body: JSON.stringify({ id }),
    });

    alert("Deleted");
    load();
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Products 🚀</h1>

      <input
        placeholder="Search..."
        className="border px-3 py-2 mb-4"
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="w-full border rounded-xl">
        <thead>
          <tr className="bg-gray-100">
            <th>#</th>
            <th>Name</th>
            <th>Slug</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((p, i) => (
            <tr key={p.id} className="border-t text-center">
              <td>{i + 1}</td>
              <td>{p.name}</td>
              <td>{p.slug}</td>
              <td>${p.price}</td>

              <td className="flex gap-2 justify-center p-2">
                <button className="bg-blue-500 text-white px-2 py-1 rounded">
                  Edit
                </button>

                <button
                  onClick={() => deleteProduct(p.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}