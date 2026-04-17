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
        <div className="space-y-3">
          {campaigns.map((c) => (
            <div
              key={c.id}
              className="border p-4 rounded flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{c.name}</p>
                <p className="text-sm text-gray-500">
                  Sent: {c.totalSent || 0}
                </p>
              </div>

              <button
                onClick={() => sendCampaign(c.id)}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                {loadingId === c.id ? "Sending..." : "Send"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}