"use client";

import { useEffect, useState } from "react";
import { useTeamStore } from "@/lib/teamStore";
import toast from "react-hot-toast";

export default function LeadsPage() {
  const { activeTeamId } = useTeamStore();

  const [leads, setLeads] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!activeTeamId) return;

    const res = await fetch(`/api/leads?teamId=${activeTeamId}`);
    const data = await res.json();
    setLeads(data);
  };

  useEffect(() => {
    load();
  }, [activeTeamId]);

  const createLead = async () => {
    if (!email) return;

    const res = await fetch("/api/leads", {
      method: "POST",
      body: JSON.stringify({
        email,
        teamId: activeTeamId,
      }),
    });

    const data = await res.json();

    if (data.error) {
      toast.error(data.error);
    } else {
      toast.success("Lead added 🚀");
      setEmail("");
      load();
    }
  };

  const generateLeads = async () => {
    if (!activeTeamId) {
      toast.error("Select a team first");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/leads/generate", {
      method: "POST",
      body: JSON.stringify({
        teamId: activeTeamId,
      }),
    });

    const data = await res.json();

    if (data.error) {
      toast.error(data.error);
    } else {
      toast.success(`Generated ${data.count} leads 🚀`);
      load();
    }

    setLoading(false);
  };

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">Leads 🚀</h1>

      {/* ADD LEAD */}
      <div className="flex gap-2">
        <input
          placeholder="Enter email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={createLead}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Add
        </button>
      </div>

      {/* GENERATE */}
      <button
        onClick={generateLeads}
        className="bg-purple-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Generating..." : "Generate Leads 🤖"}
      </button>

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