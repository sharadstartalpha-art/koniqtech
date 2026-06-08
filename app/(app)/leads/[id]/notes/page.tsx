"use client"

import { useEffect, useState } from "react"

export default function LeadNotesPage(
  { params }: any
) {

  const [notes, setNotes] = useState<any[]>([])

  const [content, setContent] =
    useState("")

  async function loadNotes() {

    const res =
      await fetch(
        `/api/leads/${params.id}/notes`
      )

    const data =
      await res.json()

    setNotes(data)

  }

  async function saveNote() {

    if (!content.trim()) return

    await fetch(
      `/api/leads/${params.id}/notes`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
          content
        })
      }
    )

    setContent("")

    loadNotes()

  }

  useEffect(() => {
    loadNotes()
  }, [])

  return (

    <div className="space-y-8">

      <div>

        <h1 className="text-5xl font-bold">
          Lead Notes
        </h1>

        <p className="text-slate-500 mt-2">
          Internal notes and conversations
        </p>

      </div>

      <div
        className="
        bg-white
        border
        rounded-3xl
        p-6
        "
      >

        <textarea
          value={content}
          onChange={e =>
            setContent(e.target.value)
          }
          placeholder="Write note..."
          className="
          w-full
          border
          rounded-xl
          p-4
          h-32
          "
        />

        <button
          onClick={saveNote}
          className="
          mt-4
          px-5
          py-3
          bg-blue-600
          text-white
          rounded-xl
          "
        >
          Add Note
        </button>

      </div>

      <div className="space-y-4">

        {notes.map(note => (

          <div
            key={note.id}
            className="
            bg-white
            border
            rounded-2xl
            p-5
            "
          >

            <div
              className="
              text-sm
              text-slate-500
              mb-3
              "
            >
              {
                new Date(
                  note.createdAt
                ).toLocaleString()
              }
            </div>

            <div>
              {note.content}
            </div>

          </div>

        ))}

      </div>

    </div>

  )

}