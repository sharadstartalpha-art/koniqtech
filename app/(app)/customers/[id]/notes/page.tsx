"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"
import {
  ArrowLeft,
  MessageSquare,
  Plus
} from "lucide-react"

export default function Page() {

  const params = useParams()

  const customerId = params.id as string

  const [notes, setNotes] = useState<any[]>([])

  const [content, setContent] = useState("")

  const [loading, setLoading] = useState(false)

  async function loadNotes() {

    if (!customerId) return

    const res = await fetch(
      `/api/customers/${customerId}/notes`
    )

    const data = await res.json()

    if (data.success) {
      setNotes(data.notes)
    }

  }

  async function saveNote() {

    if (!content.trim()) return

    setLoading(true)

    const res = await fetch(
      `/api/customers/${customerId}/notes`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          content
        })
      }
    )

    const data = await res.json()

    if (data.success) {
      setContent("")
      loadNotes()
    }

    setLoading(false)

  }

  useEffect(() => {

    loadNotes()

  }, [customerId])

  return (

    <div className="max-w-5xl mx-auto space-y-8">

      <div>

        <Link
          href={`/customers/${customerId}`}
          className="
          inline-flex
          items-center
          gap-2
          text-slate-500
          hover:text-orange-600
          mb-5
          "
        >
          <ArrowLeft size={16} />
          Back to Customer
        </Link>

        <div className="flex items-center gap-4">

          <div
            className="
            w-12
            h-12
            rounded-2xl
            bg-orange-100
            text-orange-600
            flex
            items-center
            justify-center
            "
          >
            <MessageSquare size={22} />
          </div>

          <div>

            <h1 className="text-4xl font-bold">
              Customer Notes
            </h1>

            <p className="text-slate-500">
              Internal notes and conversations
            </p>

          </div>

        </div>

      </div>

      <div
        className="
        bg-white
        border
        rounded-3xl
        shadow-sm
        p-6
        "
      >

        <h2
          className="
          text-xl
          font-semibold
          mb-4
          "
        >
          Add Note
        </h2>

        <textarea
          value={content}
          onChange={e =>
            setContent(e.target.value)
          }
          placeholder="
          Add customer notes,
          follow ups,
          reminders,
          meeting summary...
          "
          className="
          w-full
          h-40
          border
          rounded-2xl
          p-4
          resize-none
          bg-slate-50
          focus:bg-white
          "
        />

        <div className="flex justify-end mt-5">

          <button
            onClick={saveNote}
            disabled={loading}
            className="
            inline-flex
            items-center
            gap-2
            px-6
            py-3
            rounded-2xl
            bg-orange-600
            hover:bg-orange-700
            text-white
            disabled:opacity-50
            "
          >

            <Plus size={18} />

            {
              loading
                ? "Saving..."
                : "Add Note"
            }

          </button>

        </div>

      </div>

      <div className="space-y-5">

        {
          notes.length === 0 && (

            <div
              className="
              bg-white
              border
              rounded-3xl
              p-12
              text-center
              "
            >

              <div
                className="
                w-16
                h-16
                rounded-full
                bg-orange-100
                text-orange-600
                flex
                items-center
                justify-center
                mx-auto
                mb-5
                "
              >

                <MessageSquare size={26} />

              </div>

              <h3
                className="
                text-xl
                font-semibold
                "
              >
                No notes yet
              </h3>

              <p className="text-slate-500 mt-2">
                Start tracking customer interactions.
              </p>

            </div>

          )
        }

        {
          notes.map(note => (

            <div
              key={note.id}
              className="
              bg-white
              border
              rounded-3xl
              shadow-sm
              p-6
              "
            >

              <div className="flex gap-4">

                <div
                  className="
                  w-10
                  h-10
                  rounded-full
                  bg-orange-100
                  text-orange-600
                  flex
                  items-center
                  justify-center
                  "
                >
                  <MessageSquare size={16} />
                </div>

                <div className="flex-1">

                  <div
                    className="
                    flex
                    justify-between
                    text-sm
                    text-slate-500
                    mb-2
                    "
                  >

                    <span>
                      {note.author?.name || "Unknown"}
                    </span>

                    <span>
                      {new Date(
                        note.createdAt
                      ).toLocaleString()}
                    </span>

                  </div>

                  <div className="whitespace-pre-wrap text-slate-800">
                    {note.content}
                  </div>

                </div>

              </div>

            </div>

          ))
        }

      </div>

    </div>

  )

}