"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 5;

  // 🔄 LOAD
  const load = async () => {
    try {
      const res = await fetch("/api/campaign");
      const data = await res.json();
      setCampaigns(data || []);
    } catch {
      toast.error("Failed to load campaigns");
    }
  };

  useEffect(() => {
    load();
  }, []);

  // ➕ CREATE
  const createCampaign = async () => {
    const name = prompt("Campaign name");
    if (!name) return;

    try {
      const res = await fetch("/api/campaign/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          subject: "Quick question 👀",
          content: "Hi {{name}}, let's connect!",
        }),
      });

      const data = await res.json();

      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("Campaign created 🚀");
        load();
      }
    } catch {
      toast.error("Failed to create campaign");
    }
  };

  // 🚀 SEND
  const sendCampaign = async (id: string) => {
    setLoadingId(id);

    try {
      const res = await fetch("/api/campaign/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ campaignId: id }),
      });

      const data = await res.json();

      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(`Sent ${data.sent} emails 🚀`);
        load();
      }
    } catch {
      toast.error("Failed to send campaign");
    }

    setLoadingId(null);
  };

  // 🗑 DELETE
  const deleteCampaign = async (id: string) => {
    if (!confirm("Delete this campaign?")) return;

    try {
      const res = await fetch(`/api/campaign/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("Deleted ✅");
        load();
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  // 🔍 FILTER
  const filtered = campaigns.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // 📄 PAGINATION
  const start = (page - 1) * PAGE_SIZE;
  const paginated = filtered.slice(start, start + PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Campaigns 📧</h1>

        <button
          onClick={createCampaign}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Create Campaign
        </button>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search campaign..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 rounded w-full max-w-sm"
      />

      {/* TABLE */}
      {paginated.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          No campaigns found
        </div>
      ) : (
        <div className="border rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">#</th>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Sent</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginated.map((c, i) => (
                <tr key={c.id} className="border-t">
                  {/* SL NUMBER */}
                  <td className="p-3">{start + i + 1}</td>

                  <td className="p-3 font-medium">{c.name}</td>

                  <td className="p-3">
                    <span className="text-xs px-2 py-1 bg-gray-200 rounded">
                      {c.status}
                    </span>
                  </td>

                  <td className="p-3">{c.totalSent || 0}</td>

                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => sendCampaign(c.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      {loadingId === c.id ? "Sending..." : "Send"}
                    </button>

                    <button
                      onClick={() => deleteCampaign(c.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PAGINATION */}
      <div className="flex gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 border rounded"
        >
          Prev
        </button>

        <span className="px-3 py-1">
          Page {page} / {totalPages || 1}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 border rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}