"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    const res = await axios.get("/api/admin/products");
    setProducts(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  /* ➕ CREATE */
  const create = async () => {
    if (!name || !price) {
      return toast.error("Fill all fields");
    }

    try {
      setLoading(true);

      await axios.post("/api/admin/products", {
        name,
        price: Number(price),
      });

      toast.success("Product created");

      setName("");
      setPrice("");
      load();
    } catch {
      toast.error("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  /* ❌ DELETE */
  const remove = async (id: string) => {
    try {
      setDeletingId(id);

      await axios.delete(`/api/admin/products?id=${id}`);

      toast.success("Product deleted");

      load();
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Products</h1>

        <button
          onClick={create}
          disabled={loading}
          className="bg-black text-white px-4 py-1.5 text-sm rounded-md disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </div>

      {/* FORM */}
      <div className="flex gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="border px-3 py-2 rounded-md text-sm w-60"
        />

        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          type="number"
          className="border px-3 py-2 rounded-md text-sm w-40"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-md overflow-hidden">

        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Price</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">

                <td className="p-3">{p.name}</td>
                <td className="p-3">${p.price}</td>

                <td className="p-3 text-right">
                  <button
                    onClick={() => remove(p.id)}
                    disabled={deletingId === p.id}
                    className="text-red-500 text-xs disabled:opacity-50"
                  >
                    {deletingId === p.id ? "Deleting..." : "Delete"}
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </div>
  );
}