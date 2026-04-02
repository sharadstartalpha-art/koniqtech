"use client"

import { useState } from "react"

export default function LeadFinder() {
  const [query, setQuery] = useState("")
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const generateLeads = async () => {
    setLoading(true)

    const res = await fetch("/api/leads/real", {
      method: "POST",
      body: JSON.stringify({ query }),
    })

    const data = await res.json()

    setLeads(data.leads)
    setLoading(false)
  }

  const scoreLead = async (lead: any, index: number) => {
    const res = await fetch("/api/leads/score", {
      method: "POST",
      body: JSON.stringify({ lead }),
    })

    const data = await res.json()

    // ✅ attach score to that lead
    const updated = [...leads]
    updated[index] = { ...lead, ...data }

    setLeads(updated)
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Lead Finder</h1>

      <input
        placeholder="e.g. dentists in bangalore"
        className="border p-2 mr-2"
        onChange={(e) => setQuery(e.target.value)}
      />

      <button
        onClick={generateLeads}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {loading ? "Loading..." : "Generate"}
      </button>

      <div className="mt-6">
        {leads.map((lead, i) => (
          <div key={i} className="bg-white p-4 mb-4 rounded shadow">
            
            <p className="font-semibold">{lead.name}</p>
            <p>{lead.website}</p>
            <p className="text-green-600">{lead.email}</p>

            {/* 🔥 BUTTON INSIDE LOOP */}
            <button
              onClick={() => scoreLead(lead, i)}
              className="bg-blue-500 text-white px-3 py-1 mt-2 rounded"
            >
              Score & Generate Email
            </button>

            {/* ✅ SHOW RESULT HERE */}
            {lead.score && (
              <div className="mt-3 text-sm bg-gray-50 p-3 rounded">
                <p><strong>Score:</strong> {lead.score}</p>
                <p><strong>Reason:</strong> {lead.reason}</p>
                <p className="text-green-700">
                  <strong>Email:</strong> {lead.email}
                </p>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  )
}