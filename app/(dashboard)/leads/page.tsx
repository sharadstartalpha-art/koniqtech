"use client";

import { useEffect, useState } from "react";
import { useTeamStore } from "@/lib/teamStore";
import toast from "react-hot-toast";
import ProjectSwitcher from "@/components/ProjectSwitcher";

export default function LeadsPage() {
  const { activeTeamId } = useTeamStore();

  const [leads, setLeads] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [projectId, setProjectId] = useState("");

  // 🔥 LOAD LEADS
  const load = async () => {
    if (!activeTeamId) return;

    const res = await fetch(`/api/leads?teamId=${activeTeamId}`);
    const data = await res.json();
    setLeads(data);
  };

  useEffect(() => {
    load();
  }, [activeTeamId]);

  // 🔥 GENERATE LEADS
  const generateLeads = async () => {
    if (!activeTeamId) {
      toast.error("Select a team first");
      return;
    }

    if (!projectId) {
      toast.error("Select or create a project first");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/leads/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teamId: activeTeamId,
        projectId,
        query,
      }),
    });

    const data = await res.json();

    if (data.error) {
      toast.error(data.error);
    } else {
      toast.success(`Generated ${data.count} leads 🚀`);
      setQuery("");
      load();
    }

    setLoading(false);
  };

  // 🔥 SEND CAMPAIGN
  const sendCampaign = async () => {
    setSending(true);

    const res = await fetch("/api/campaign/send", {
      method: "POST",
    });

    const data = await res.json();

    if (data.error) {
      toast.error(data.error);
    } else {
      toast.success("Emails sent 🚀");
    }

    setSending(false);
  };

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">Lead Engine 🚀</h1>

      {/* 🔥 PROJECT SELECTOR */}
      <ProjectSwitcher onChange={(id) => setProjectId(id)} />

      {/* 🔍 SEARCH */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search leads (e.g. SaaS founder USA)"
        className="border p-2 w-full rounded"
      />

      {/* ACTIONS */}
      <div className="flex gap-3">
        <button
          onClick={generateLeads}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Generating..." : "Generate Leads 🤖"}
        </button>

        <button
          onClick={sendCampaign}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {sending ? "Sending..." : "Send Campaign 📧"}
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-2">
        {leads.map((lead) => (
          <div key={lead.id} className="border p-3 rounded">
            {lead.email} {lead.company && `- ${lead.company}`}
          </div>
        ))}
      </div>

    </div>
  );
}