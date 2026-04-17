"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function CampaignPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);

  const load = async () => {
    const res = await fetch("/api/campaign");
    const data = await res.json();
    setCampaigns(data);
  };

  useEffect(() => {
    load();
  }, []);

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
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Campaigns 📧</h1>

      <table className="w-full border rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3">Status</th>
            <th className="p-3">Sent</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {campaigns.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="p-3">{c.name}</td>
              <td className="p-3">{c.status}</td>
              <td className="p-3">{c.totalSent}</td>

              <td className="p-3">
                <button
                  onClick={() => sendCampaign(c.id)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Send 🚀
                </button>
              </td>
            </tr>
          ))}

          {campaigns.length === 0 && (
            <tr>
              <td colSpan={4} className="p-4 text-center">
                No campaigns yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}