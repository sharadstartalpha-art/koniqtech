"use client";

import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import toast from "react-hot-toast";

import {
  Package,
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  Boxes,
} from "lucide-react";

/* =========================
   TYPES
========================= */

type Product = {
  id: string;
  name: string;
  slug: string;
};

/* =========================
   PAGE
========================= */

export default function ProductsPage() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [name, setName] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [
    deletingId,
    setDeletingId,
  ] = useState<
    string | null
  >(null);

  const [editing, setEditing] =
    useState<Product | null>(
      null
    );

  /* =========================
     LOAD PRODUCTS
  ========================= */

  const load = async () => {
    try {
      const res =
        await axios.get(
          "/api/admin/products",
          {
            headers: {
              "Cache-Control":
                "no-cache",
            },
          }
        );

      setProducts(
        res.data
      );

    } catch {
      toast.error(
        "Failed to load products"
      );
    }
  };

  useEffect(() => {
    load();
  }, []);

  /* =========================
     CREATE PRODUCT
  ========================= */

  const create = async () => {
    if (!name.trim()) {
      toast.error(
        "Enter product name"
      );

      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "/api/admin/products",
        {
          name,
        }
      );

      toast.success(
        "Product created"
      );

      setName("");

      load();

    } catch {
      toast.error(
        "Failed to create product"
      );

    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UPDATE PRODUCT
  ========================= */

  const update = async () => {
    if (!editing) return;

    try {
      setLoading(true);

      await axios.put(
        "/api/admin/products",
        {
          id: editing.id,
          name:
            editing.name,
        }
      );

      toast.success(
        "Product updated"
      );

      setEditing(null);

      load();

    } catch {
      toast.error(
        "Update failed"
      );

    } finally {
      setLoading(false);
    }
  };

  /* =========================
     DELETE PRODUCT
  ========================= */

  const remove = async (
    id: string
  ) => {
    try {
      setDeletingId(id);

      await axios.delete(
        `/api/admin/products?id=${id}`
      );

      toast.success(
        "Product deleted"
      );

      load();

    } catch {
      toast.error(
        "Delete failed"
      );

    } finally {
      setDeletingId(null);
    }
  };

  /* =========================
     FILTER PRODUCTS
  ========================= */

  const filtered =
    products.filter((p) =>
      p.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  /* =========================
     UI
  ========================= */

  return (
    <div className="space-y-8">

      {/* HERO */}

      <div className="bg-gradient-to-r from-black to-gray-900 rounded-3xl p-8 text-white relative overflow-hidden">

        <div className="absolute right-0 top-0 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex items-start justify-between flex-wrap gap-6">

          <div>

            <p className="text-orange-400 text-sm font-medium mb-3">
              Product Management
            </p>

            <h1 className="text-4xl font-bold">
              SaaS Products
            </h1>

            <p className="text-gray-300 mt-4 max-w-2xl leading-7">
              Manage your SaaS products,
              subscriptions, billing systems,
              and product infrastructure from
              one place.
            </p>

          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-5 min-w-[220px]">

            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center">

                <Boxes size={28} />

              </div>

              <div>

                <p className="text-sm text-gray-300">
                  Total Products
                </p>

                <h2 className="text-3xl font-bold mt-1">
                  {
                    products.length
                  }
                </h2>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* CREATE SECTION */}

      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">

        <div className="flex items-center justify-between mb-6">

          <div>

            <h2 className="text-xl font-bold text-gray-900">
              Create Product
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Add a new SaaS product to your
              platform
            </p>

          </div>

        </div>

        <div className="flex flex-col lg:flex-row gap-4">

          {/* INPUT */}

          <div className="relative flex-1">

            <Package
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              placeholder="Enter product name..."
              className="w-full border border-gray-200 rounded-2xl pl-11 pr-4 py-4 outline-none focus:border-orange-400 transition"
            />

          </div>

          {/* BUTTON */}

          <button
            onClick={create}
            disabled={loading}
            className="bg-black hover:bg-gray-900 transition text-white px-6 py-4 rounded-2xl font-medium flex items-center justify-center gap-2 min-w-[180px]"
          >

            <Plus size={18} />

            {loading
              ? "Creating..."
              : "Create Product"}

          </button>

        </div>

      </div>

      {/* PRODUCTS TABLE */}

      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">

        {/* TABLE HEADER */}

        <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">

          <div>

            <h2 className="text-xl font-bold text-gray-900">
              Products
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Manage and edit your products
            </p>

          </div>

          {/* SEARCH */}

          <div className="relative w-full lg:w-80">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search products..."
              className="w-full border border-gray-200 bg-gray-50 rounded-2xl pl-11 pr-4 py-3 outline-none focus:border-orange-400 focus:bg-white transition"
            />

          </div>

        </div>

        {/* TABLE */}

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-50 border-b">

              <tr>

                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Product
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Slug
                </th>

                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filtered.map(
                (p) => (
                  <tr
                    key={p.id}
                    className="border-b last:border-0 hover:bg-gray-50 transition"
                  >

                    {/* PRODUCT */}

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-4">

                        <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">

                          <Package
                            size={
                              22
                            }
                          />

                        </div>

                        <div>

                          <h3 className="font-semibold text-gray-900">
                            {p.name}
                          </h3>

                          <p className="text-xs text-gray-400 mt-1">
                            Product ID:{" "}
                            {p.id.slice(
                              0,
                              8
                            )}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* SLUG */}

                    <td className="px-6 py-5">

                      <div className="inline-flex bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                        {p.slug}
                      </div>

                    </td>

                    {/* ACTIONS */}

                    <td className="px-6 py-5">

                      <div className="flex items-center justify-end gap-3">

                        <button
                          onClick={() =>
                            setEditing(
                              p
                            )
                          }
                          className="inline-flex items-center gap-2 border border-gray-200 hover:bg-gray-50 px-4 py-2 rounded-xl text-sm transition"
                        >

                          <Pencil
                            size={
                              14
                            }
                          />

                          Edit

                        </button>

                        <button
                          onClick={() =>
                            remove(
                              p.id
                            )
                          }
                          disabled={
                            deletingId ===
                            p.id
                          }
                          className="inline-flex items-center gap-2 border border-red-200 text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl text-sm transition"
                        >

                          <Trash2
                            size={
                              14
                            }
                          />

                          {deletingId ===
                          p.id
                            ? "Deleting..."
                            : "Delete"}

                        </button>

                      </div>

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

        {/* EMPTY */}

        {filtered.length ===
          0 && (
          <div className="py-20 text-center">

            <div className="w-20 h-20 mx-auto rounded-3xl bg-gray-100 flex items-center justify-center mb-5">

              <Package
                size={32}
                className="text-gray-400"
              />

            </div>

            <h3 className="text-lg font-semibold text-gray-900">
              No products found
            </h3>

            <p className="text-gray-500 mt-2">
              Create your first SaaS product
            </p>

          </div>
        )}

      </div>

      {/* =========================
         EDIT MODAL
      ========================= */}

      {editing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">

          <div className="bg-white w-full max-w-md rounded-3xl p-7 shadow-2xl">

            {/* HEADER */}

            <div className="flex items-start justify-between mb-6">

              <div>

                <h2 className="text-2xl font-bold text-gray-900">
                  Edit Product
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Update product information
                </p>

              </div>

              <button
                onClick={() =>
                  setEditing(
                    null
                  )
                }
                className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center"
              >

                <X size={18} />

              </button>

            </div>

            {/* INPUT */}

            <div className="mb-6">

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name
              </label>

              <input
                value={
                  editing.name
                }
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    name:
                      e.target
                        .value,
                  })
                }
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-orange-400"
              />

            </div>

            {/* ACTIONS */}

            <div className="flex justify-end gap-3">

              <button
                onClick={() =>
                  setEditing(
                    null
                  )
                }
                className="px-5 py-3 rounded-2xl border border-gray-200"
              >
                Cancel
              </button>

              <button
                onClick={update}
                disabled={loading}
                className="px-5 py-3 rounded-2xl bg-black text-white hover:opacity-90 transition"
              >
                {loading
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}