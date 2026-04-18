"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

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

  return (
    <div className="p-6 space-y-6">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Campaigns 📧</h1>

        <button
          onClick={createCampaign}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Create Campaign
        </button>
      </div>

      {campaigns.length === 0 ? (
  <div className="text-center text-gray-500 mt-10">
    No campaigns yet
  </div>
) : (
  <div className="border rounded overflow-hidden">
    <table className="w-full text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="text-left p-3">Name</th>
          <th className="text-left p-3">Status</th>
          <th className="text-left p-3">Sent</th>
          <th className="text-left p-3">Actions</th>
        </tr>
      </thead>

      <tbody>
        {campaigns.map((c) => (
          <tr key={c.id} className="border-t">
            <td className="p-3 font-medium">{c.name}</td>

            <td className="p-3">
              <span className="text-xs px-2 py-1 bg-gray-200 rounded">
                {c.status}
              </span>
            </td>

            <td className="p-3">{c.totalSent || 0}</td>

            <td className="p-3">
              <button
                onClick={() => sendCampaign(c.id)}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                {loadingId === c.id ? "Sending..." : "Send"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
    </div>
  );
}