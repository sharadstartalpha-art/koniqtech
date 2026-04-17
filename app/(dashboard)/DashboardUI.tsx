"use client";

import { useState } from "react";

export default function DashboardUI({ products, projects }: any) {
  const [activeProduct, setActiveProduct] = useState(products[0]?.slug);

  const filteredProjects = projects.filter(
    (p: any) => p.product.slug === activeProduct
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* PRODUCT TABS */}
      <div className="flex gap-2">
        {products.map((product: any) => (
          <button
            key={product.id}
            onClick={() => setActiveProduct(product.slug)}
            className={`px-4 py-2 rounded-lg border ${
              activeProduct === product.slug
                ? "bg-black text-white"
                : "bg-white"
            }`}
          >
            {product.name}
          </button>
        ))}
      </div>

      {/* CREATE PROJECT */}
      <form
        action="/api/projects"
        method="POST"
        className="flex gap-2"
      >
        <input
          name="name"
          placeholder="New project name"
          className="border p-2 flex-1 rounded-lg"
          required
        />

        <input type="hidden" name="productSlug" value={activeProduct} />

        <button className="bg-black text-white px-4 py-2 rounded-lg">
          Create
        </button>
      </form>

      {/* PROJECT LIST */}
      <div className="space-y-3">
        {filteredProjects.length === 0 && (
          <p className="text-gray-500">No projects yet</p>
        )}

        {filteredProjects.map((project: any) => (
          <div
            key={project.id}
            className="p-4 border rounded-lg flex justify-between items-center bg-white"
          >
            <div>
              <p className="font-medium">{project.name}</p>
              <p className="text-xs text-gray-500">
                {new Date(project.createdAt).toLocaleString()}
              </p>
            </div>

            <form
              action={`/api/projects/${project.id}`}
              method="POST"
            >
              <button className="text-red-500 text-sm">
                Delete
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}