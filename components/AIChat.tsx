"use client"

import { useEffect, useRef, useState } from "react"

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
}

export default function AIChat({
  projectId,
  initialMessages,
}: {
  projectId: string
  initialMessages: Message[]
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const bottomRef = useRef<HTMLDivElement | null>(null)

  // ✅ AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return

    const userText = input

    const userMessage: Message = {
      id: Date.now().toString(),
      content: userText,
      role: "user",
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    const res = await fetch("/api/ai", {
      method: "POST",
      body: JSON.stringify({
        message: userText,
        projectId,
      }),
    })

    const data = await res.json()

    // ✅ CREATE EMPTY AI MESSAGE
    const aiMessageId = Date.now().toString()

    setMessages((prev) => [
      ...prev,
      { id: aiMessageId, content: "", role: "assistant" },
    ])

    // ✅ TYPING EFFECT (CHAR BY CHAR)
    const fullText: string = data.reply || ""
    let currentText = ""

    for (let i = 0; i < fullText.length; i++) {
      currentText += fullText[i]

      await new Promise((resolve) => setTimeout(resolve, 15))

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? { ...msg, content: currentText }
            : msg
        )
      )
    }

    setLoading(false)
  }

  return (
    <div className="border rounded p-4 mt-6 flex flex-col h-[500px]">
      <h2 className="font-semibold mb-3">🤖 AI Assistant</h2>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-[75%] text-sm ${
                m.role === "user"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {/* auto scroll anchor */}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <form onSubmit={sendMessage} className="flex gap-2 mt-3">
  <input
    value={input}
    onChange={(e) => setInput(e.target.value)}
    placeholder="Ask something..."
    className="border p-2 flex-1 rounded"
  />

  <button
  type="submit"
  disabled={loading}
  className="bg-black text-white px-4 rounded disabled:opacity-50"
>
  {loading ? "..." : "Send"}
</button>
</form>

      {loading && (
        <p className="text-xs text-gray-400 mt-1">AI is typing...</p>
      )}
    </div>
  )
}