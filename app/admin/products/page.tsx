"use client";

import { useEffect, useState } from "react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);

  const load = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;

    await fetch("/api/products/delete", {
      method: "POST",
      body: JSON.stringify({ id }),
    });

    load();
  };

  const handleEdit = async (id: string) => {
    const name = prompt("New name:");
    const price = prompt("New price:");

    if (!name || !price) return;

    await fetch("/api/products/update", {
      method: "POST",
      body: JSON.stringify({ id, name, price: Number(price) }),
    });

    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Products 🚀</h1>

      <table className="w-full border">
        <thead>
          <tr className="border-b">
            <th>#</th>
            <th>Name</th>
            <th>Slug</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p: any, i) => (
            <tr key={p.id} className="border-b text-center">
              <td>{i + 1}</td>
              <td>{p.name}</td>
              <td>{p.slug}</td>
              <td>${p.price}</td>
              <td className="space-x-2">
                <button
                  onClick={() => handleEdit(p.id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(p.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
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