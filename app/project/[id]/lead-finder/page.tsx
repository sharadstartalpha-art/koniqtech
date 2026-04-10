"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import UpgradeModal from "@/components/UpgradeModal";

export default function LeadFinder() {
  const [query, setQuery] = useState("");
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  // ✅ Fetch credits
  const fetchCredits = async () => {
    const res = await fetch("/api/user/credits");
    const data = await res.json();
    setCredits(data.credits);
  };

  useEffect(() => {
    fetchCredits();
  }, []);

  // ✅ Generate Leads (FIXED)
  const generateLeads = async () => {
    setLoading(true);

    const projectId = localStorage.getItem("projectId");

    const res = await fetch("/api/leads/real", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-project-id": projectId || "",
      },
      body: JSON.stringify({ query }),
    });

    if (res.status === 403) {
      toast.error("No credits left 🚫");
      setShowUpgrade(true);
      setLoading(false);
      return;
    }

    const data = await res.json();
    setLeads(data.leads);
    setLoading(false);

    await fetchCredits();
    toast.success("Leads generated 🚀");
  };

  // ✅ Send emails (FIX projectId)
  const sendEmails = async () => {
    const projectId = localStorage.getItem("projectId");

    const res = await fetch("/api/leads/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-project-id": projectId || "",
      },
      body: JSON.stringify({ leads }),
    });

    if (res.status === 402) {
      toast.error("No credits for email 🚫");
      setShowUpgrade(true);
      return;
    }

    const data = await res.json();
    setLeads(data.leads);

    await fetchCredits();
    toast.success("Emails sent ✅");
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Lead Finder</h1>

      {credits === 0 && (
        <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
          ⚠ You're out of credits — upgrade to continue
        </div>
      )}

      <input
        placeholder="dentists in bangalore"
        className="border p-2 mr-2"
        onChange={(e) => setQuery(e.target.value)}
      />

      <button
        onClick={generateLeads}
        disabled={credits === 0}
        className={`px-4 py-2 rounded ${
          credits === 0
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-black text-white"
        }`}
      >
        {credits === 0
          ? "No Credits Left"
          : loading
          ? "Loading..."
          : "Generate"}
      </button>

      <button
        onClick={sendEmails}
        className="bg-green-600 text-white px-4 py-2 ml-2 rounded"
      >
        Send Emails
      </button>

      {/* LEADS */}
      <div className="mt-6">
        {leads.map((lead, i) => (
          <div key={i} className="bg-white p-4 mb-4 rounded shadow">
            <p className="font-semibold">{lead.name}</p>
            <p>{lead.website}</p>

            <p className="text-green-600">
              {lead.contactEmail || "No email"}
            </p>
          </div>
        ))}
      </div>

      {/* ✅ FIXED MODAL */}
     {showUpgrade && <UpgradeModal />}
    </div>
  );
}