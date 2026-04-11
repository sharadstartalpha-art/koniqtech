"use client";

import { useState } from "react";

export default function CampaignPage() {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  const createCampaign = async () => {
    await fetch("/api/campaigns/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, subject, content }),
    });

    alert("Campaign created 🚀");
  };

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-4">

      <h1 className="text-2xl font-bold">Email Campaigns 📬</h1>

      <input
        placeholder="Campaign name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 w-full rounded"
      />

      <input
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="border p-2 w-full rounded"
      />

      <textarea
        placeholder="Email content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="border p-2 w-full rounded h-32"
      />

      <button
        onClick={createCampaign}
        className="bg-black text-white px-4 py-2 rounded-lg w-full"
      >
        Create Campaign
      </button>

    </div>
  );
}