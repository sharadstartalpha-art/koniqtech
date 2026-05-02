"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";
import toast from "react-hot-toast";

/* =========================
   TYPES
========================= */
type LinkType = {
  id: string;
  title: string;
  url: string;
};

/* =========================
   PAGE
========================= */
export default function PaymentLinksPage() {
  const [links, setLinks] = useState<LinkType[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  /* =========================
     LOAD
  ========================= */
  const load = async () => {
    try {
      const res = await axios.get("/api/payment-links");
      setLinks(res.data);
    } catch {
      toast.error("Failed to load links");
    }
  };

  useEffect(() => {
    load();
  }, []);

  /* =========================
     CREATE
  ========================= */
  const create = async () => {
    if (!title || !url) {
      return toast.error("Fill all fields");
    }

    try {
      await axios.post("/api/payment-links", {
        title,
        url,
      });

      toast.success("Link saved");

      setTitle("");
      setUrl("");
      load();
    } catch {
      toast.error("Failed to create link");
    }
  };

  /* =========================
     DELETE
  ========================= */
  const remove = async (id: string) => {
    if (!confirm("Delete this link?")) return;

    try {
      await axios.delete(`/api/payment-links?id=${id}`);
      toast.success("Deleted");
      load();
    } catch {
      toast.error("Delete failed");
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <Layout>
      <div className="space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-semibold">Payment Links</h1>

          <button
            onClick={create}
            className="bg-black text-white px-4 py-1.5 text-sm rounded-md"
          >
            Create Link
          </button>
        </div>

        {/* FORM */}
        <div className="flex gap-3">
          <input
            placeholder="Title (PayPal / Stripe)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border px-3 py-2 rounded-md text-sm w-60"
          />

          <input
            placeholder="Paste payment link"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="border px-3 py-2 rounded-md text-sm w-80"
          />
        </div>

        {/* TABLE */}
        <div className="bg-white border rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Link</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {links.map((l) => (
                <tr key={l.id} className="border-t">

                  <td className="p-3">{l.title}</td>

                  <td className="p-3 text-blue-600 text-xs">
                    <a href={l.url} target="_blank">
                      {l.url}
                    </a>
                  </td>

                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(l.url);
                        toast.success("Copied!");
                      }}
                      className="text-xs border px-2 py-1 rounded"
                    >
                      Copy
                    </button>

                    <button
                      onClick={() => remove(l.id)}
                      className="text-xs text-red-500"
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>

          {links.length === 0 && (
            <div className="p-4 text-center text-gray-400">
              No links yet
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
}