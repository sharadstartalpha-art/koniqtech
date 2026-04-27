"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
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
    await axios.post("/api/admin/products", {
      name,
      price: Number(price),
    });
    load();
  };

  return (
    <div className="p-10">
      <h1 className="text-xl mb-4">Products</h1>

      <div className="mb-6">
        <input
          placeholder="Name"
          className="border p-2 mr-2"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Price"
          className="border p-2 mr-2"
          onChange={(e) => setPrice(e.target.value)}
        />
        <button
          onClick={create}
          className="bg-black text-white px-4 py-2"
        >
          Add
        </button>
      </div>

      <table className="w-full border">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p: any) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>${p.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}