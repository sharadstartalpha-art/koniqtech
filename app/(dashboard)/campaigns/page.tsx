"use client";

import { useEffect, useState } from "react";
import { useTeamStore } from "@/lib/teamStore";
import toast from "react-hot-toast";

export default function CampaignsPage() {
  const { activeTeamId } = useTeamStore();
  const [campaigns, setCampaigns] = useState<any[]>([]);

  const load = async () => {
    const res = await fetch(`/api/campaign?teamId=${activeTeamId}`);
    const data = await res.json();
    setCampaigns(data);
  };

  useEffect(() => {
    if (activeTeamId) load();
  }, [activeTeamId]);

  const sendCampaign = async (id: string) => {
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
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Campaigns 📧</h1>

      {campaigns.length === 0 ? (
        <p>No campaigns yet</p>
      ) : (
        campaigns.map((c) => (
          <div key={c.id} className="border p-4 rounded">
            <div className="font-bold">{c.name}</div>
            <div className="text-sm text-gray-500">
              {c.subject}
            </div>
            

            <button
              onClick={() => sendCampaign(c.id)}
              className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
            >
              Send 🚀
            </button>
          </div>
        ))
      )}
    </div>
  );
}