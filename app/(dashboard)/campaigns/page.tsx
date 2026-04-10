"use client";

import { useState } from "react";

export default function CampaignPage() {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  const createCampaign = async () => {
    await fetch("/api/campaigns/create", {
      method: "POST",
      body: JSON.stringify({ name, subject, content }),
    });

    alert("Campaign created");
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Email Campaigns 📬</h1>

      <input
        placeholder="Campaign name"
        onChange={(e) => setName(e.target.value)}
        className="border p-2"
      />

      <input
        placeholder="Subject"
        onChange={(e) => setSubject(e.target.value)}
        className="border p-2"
      />

      <textarea
        placeholder="Email content"
        onChange={(e) => setContent(e.target.value)}
        className="border p-2"
      />

      <button
        onClick={createCampaign}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Create Campaign
      </button>
    </div>
  );
}