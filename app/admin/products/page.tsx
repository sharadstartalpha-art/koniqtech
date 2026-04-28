"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const load = async () => {
    const res = await axios.get("/api/admin/products");
    setProducts(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    if (!name || !price) return;

    await axios.post("/api/admin/products", {
      name,
      price: Number(price),
    });

    setName("");
    setPrice("");
    load();
  };

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-medium">Products</h1>

        <button
          onClick={create}
          className="bg-black text-white text-sm px-3 py-1.5 rounded-md"
        >
          Add Product
        </button>
      </div>

      {/* INPUTS */}
      <div className="flex gap-3 max-w-md">
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-200 rounded-md px-3 py-2 text-sm w-full"
        />

        <input
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border border-gray-200 rounded-md px-3 py-2 text-sm w-32"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-200 rounded-md overflow-hidden">

        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b text-gray-600">
            <tr>
              <th className="text-left px-4 py-2 font-medium">Name</th>
              <th className="text-left px-4 py-2 font-medium">Price</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{p.name}</td>
                <td className="px-4 py-2">${p.price}</td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}