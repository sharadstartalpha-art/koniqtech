"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

type Product = {
  id: string;
  name: string;
  price: number;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  /* EDIT STATE */
  const [editing, setEditing] = useState<Product | null>(null);

  /* =========================
     LOAD
  ========================= */
  const load = async () => {
    const res = await axios.get("/api/admin/products", {
      headers: { "Cache-Control": "no-cache" },
    });
    setProducts(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  /* =========================
     CREATE
  ========================= */
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

  /* =========================
     UPDATE
  ========================= */
  const update = async () => {
    if (!editing) return;

    try {
      setLoading(true);

      await axios.put("/api/admin/products", {
        id: editing.id,
        name: editing.name,
        price: Number(editing.price),
      });

      toast.success("Product updated");

      setEditing(null);
      load();
    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     DELETE
  ========================= */
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
          className="bg-black text-white px-4 py-1.5 text-sm rounded-md"
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </div>

      {/* CREATE FORM */}
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

                <td className="p-3 text-right space-x-3">

                  {/* EDIT */}
                  <button
                    onClick={() => setEditing(p)}
                    className="text-blue-600 text-xs"
                  >
                    Edit
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={() => remove(p.id)}
                    disabled={deletingId === p.id}
                    className="text-red-500 text-xs"
                  >
                    {deletingId === p.id ? "Deleting..." : "Delete"}
                  </button>

                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* =========================
         EDIT MODAL
      ========================= */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-80">

            <h2 className="font-semibold mb-4">Edit Product</h2>

            <input
              value={editing.name}
              onChange={(e) =>
                setEditing({ ...editing, name: e.target.value })
              }
              className="w-full border p-2 mb-3"
            />

            <input
              type="number"
              value={editing.price}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  price: Number(e.target.value),
                })
              }
              className="w-full border p-2 mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditing(null)}
                className="border px-3 py-1"
              >
                Cancel
              </button>

              <button
                onClick={update}
                className="bg-black text-white px-3 py-1 rounded"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}