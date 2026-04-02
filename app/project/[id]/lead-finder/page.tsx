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

    const updated = [...leads]
    updated[index] = { ...lead, ...data }

    setLeads(updated)
  }

  const sendEmails = async () => {
    const res = await fetch("/api/leads/send", {
      method: "POST",
      body: JSON.stringify({ leads }),
    })

    const data = await res.json()
    setLeads(data.leads)
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Lead Finder</h1>

      <input
        placeholder="dentists in bangalore"
        className="border p-2 mr-2"
        onChange={(e) => setQuery(e.target.value)}
      />

      <button
        onClick={generateLeads}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {loading ? "Loading..." : "Generate"}
      </button>

      <button
        onClick={sendEmails}
        className="bg-green-600 text-white px-4 py-2 ml-2 rounded"
      >
        Send Emails
      </button>

      <div className="mt-6">
        {leads.map((lead, i) => (
          <div key={i} className="bg-white p-4 mb-4 rounded shadow">
            
            <p className="font-semibold">{lead.name}</p>
            <p>{lead.website}</p>

            {/* ✅ REAL EMAIL */}
            <p className="text-green-600">
              {lead.contactEmail || "No email"}
            </p>

            <button
              onClick={() => scoreLead(lead, i)}
              className="bg-blue-500 text-white px-3 py-1 mt-2 rounded"
            >
              Generate AI Email
            </button>


<button
  onClick={async () => {
    await fetch("/api/sequences/create", {
      method: "POST",
      body: JSON.stringify({
        leadId: lead.id,
        generatedEmail: lead.generatedEmail,
      }),
    })

    alert("Sequence started 🚀")
  }}
  className="bg-purple-600 text-white px-3 py-1 mt-2 rounded"
>
  Start Sequence
</button>


            {/* ✅ AI EMAIL */}
            {lead.generatedEmail && (
              <div className="mt-2 bg-gray-100 p-2 rounded text-sm">
                <p><strong>AI Email:</strong></p>
                <p>{lead.generatedEmail}</p>
              </div>
            )}

            {/* ✅ STATUS */}
            {lead.sent && (
              <p className="text-green-600 mt-2">
                ✅ Email Sent
              </p>
            )}

          </div>
        ))}
      </div>
    </div>
  )
}