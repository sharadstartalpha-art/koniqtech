"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"
import {
  ArrowLeft,
  MessageSquare,
  Plus
} from "lucide-react"

export default function LeadNotesPage() {

  const params = useParams()

  const leadId = params.id as string

  const [notes,setNotes] =
    useState<any[]>([])

  const [content,setContent] =
    useState("")

  const [loading,setLoading] =
    useState(false)

 async function loadNotes(){

  if(!leadId) return

  const res =
    await fetch(
      `/api/leads/${leadId}/notes`
    )

  const data =
    await res.json()

  setNotes(data)

}

  async function saveNote(){

  if(!leadId) return

  if(!content.trim()) return

  setLoading(true)

  await fetch(
    `/api/leads/${leadId}/notes`,
    {
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        content
      })
    }
  )

  setContent("")

  await loadNotes()

  setLoading(false)

}

useEffect(() => {

  if(!leadId) return

  loadNotes()

}, [leadId])

  return(

    <div className="
    max-w-5xl
    mx-auto
    space-y-6
    ">

      {/* Header */}

      <div>

        <Link
          href={`/leads/${leadId}`}
          className="
          inline-flex
          items-center
          gap-2
          text-slate-500
          hover:text-orange-600
          mb-4
          "
        >
          <ArrowLeft size={16}/>
          Back to Lead
        </Link>

        <div className="
        flex
        items-center
        gap-4
        ">
          <div className="
          w-12
          h-12
          rounded-2xl
          bg-orange-100
          text-orange-600
          flex
          items-center
          justify-center
          ">
            <MessageSquare size={22}/>
          </div>

          <div>

            <h1 className="
            text-3xl
            font-bold
            text-slate-900
            ">
              Lead Notes
            </h1>

            <p className="
            text-slate-500
            mt-1
            ">
              Internal notes, updates and conversations
            </p>

          </div>

        </div>

      </div>

      {/* Composer */}

      <div className="
      bg-white
      border
      rounded-3xl
      shadow-sm
      p-6
      ">

        <h2 className="
        font-semibold
        text-lg
        mb-4
        ">
          Add Note
        </h2>

        <textarea
          value={content}
          onChange={e=>
            setContent(e.target.value)
          }
          placeholder="
          Add internal notes, call summaries,
          customer updates or reminders...
          "
          className="
          w-full
          h-36
          border
          rounded-2xl
          p-4
          resize-none
          bg-slate-50
          focus:bg-white
          focus:border-orange-500
          "
        />

        <div className="
        flex
        justify-end
        mt-4
        ">

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
            font-medium
            transition
            disabled:opacity-50
            "
          >
            <Plus size={18}/>

            {
              loading
              ? "Saving..."
              : "Add Note"
            }

          </button>

        </div>

      </div>

      {/* Notes Timeline */}

      <div className="space-y-4">

        {
          notes.length === 0 && (

            <div className="
            bg-white
            border
            rounded-3xl
            p-12
            text-center
            ">

              <div className="
              w-16
              h-16
              mx-auto
              rounded-full
              bg-orange-100
              flex
              items-center
              justify-center
              text-orange-600
              mb-4
              ">
                <MessageSquare size={24}/>
              </div>

              <h3 className="
              text-xl
              font-semibold
              ">
                No notes yet
              </h3>

              <p className="
              text-slate-500
              mt-2
              ">
                Start tracking customer conversations
                and internal updates.
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

              <div className="
              flex
              items-start
              gap-4
              ">

                <div className="
                w-10
                h-10
                rounded-full
                bg-orange-100
                flex
                items-center
                justify-center
                text-orange-600
                flex-shrink-0
                ">
                  <MessageSquare size={16}/>
                </div>

                <div className="flex-1">

                  <div className="
                  text-sm
                  text-slate-500
                  mb-3
                  ">
                    {
                      new Date(
                        note.createdAt
                      ).toLocaleString()
                    }
                  </div>

                  <div className="
                  text-slate-800
                  leading-relaxed
                  whitespace-pre-wrap
                  ">
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