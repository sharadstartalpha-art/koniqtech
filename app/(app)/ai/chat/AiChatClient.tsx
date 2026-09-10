"use client";

import { FormEvent, useRef, useState } from "react";

type ChatMessage = { role: "user" | "assistant"; content: string };
const SUGGESTIONS = ["What needs attention today?", "Summarize the latest jobs.", "Which invoices appear overdue?", "What are the newest leads?"];

export default function AiChatClient() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [prompt, setPrompt] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = prompt.trim();
    if (!question || isSending) return;
    setPrompt(""); setError(""); setIsSending(true);
    setMessages((current) => [...current, { role: "user", content: question }, { role: "assistant", content: "" }]);
    try {
      const response = await fetch("/api/ai/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: question }) });
      if (!response.ok || !response.body) { const data = await response.json().catch(() => null); throw new Error(data?.error || "The AI Assistant is unavailable right now."); }
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let answer = "";
      while (true) {
        const { value, done } = await reader.read(); if (done) break;
        answer += decoder.decode(value, { stream: true });
        setMessages((current) => { const updated = [...current]; updated[updated.length - 1] = { role: "assistant", content: answer }; return updated; });
      }
    } catch (caughtError) {
      setMessages((current) => current.slice(0, -1));
      setError(caughtError instanceof Error ? caughtError.message : "The AI Assistant is unavailable right now.");
    } finally { setIsSending(false); inputRef.current?.focus(); }
  }

  return <div className="space-y-6"><div className="rounded-3xl border bg-white p-6 shadow-sm"><div className="mb-5 flex items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-lg text-white">✦</div><div><h2 className="text-xl font-bold">Ask about your CRM</h2><p className="mt-1 text-sm text-slate-600">Live, read-only answers based on your organization’s leads, customers, jobs, invoices, tasks, and knowledge base.</p></div></div>{messages.length === 0 ? <div className="rounded-2xl bg-slate-50 p-5"><p className="font-medium text-slate-800">Try one of these:</p><div className="mt-3 flex flex-wrap gap-2">{SUGGESTIONS.map((suggestion) => <button key={suggestion} type="button" onClick={() => setPrompt(suggestion)} className="rounded-xl border bg-white px-3 py-2 text-sm text-blue-700 hover:border-blue-300 hover:bg-blue-50">{suggestion}</button>)}</div></div> : <div className="max-h-[520px] space-y-4 overflow-y-auto pr-1" aria-live="polite">{messages.map((message, index) => <div key={`${message.role}-${index}`} className={message.role === "user" ? "ml-8 rounded-2xl bg-blue-600 p-4 text-white" : "mr-8 rounded-2xl bg-slate-100 p-4 text-slate-900"}><p className="mb-1 text-xs font-semibold uppercase tracking-wide opacity-70">{message.role === "user" ? "You" : "Koniqtech AI"}</p><p className="whitespace-pre-wrap leading-6">{message.content || "Thinking…"}</p></div>)}</div>}<form onSubmit={sendMessage} className="mt-6 border-t pt-5"><label htmlFor="ai-prompt" className="sr-only">Ask Koniqtech AI</label><textarea ref={inputRef} id="ai-prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} rows={3} maxLength={4000} disabled={isSending} placeholder="Ask a question about your CRM…" className="w-full resize-y rounded-2xl border px-4 py-3 focus:border-blue-500 focus:outline-none disabled:bg-slate-50" />{error && <p className="mt-2 text-sm text-red-600">{error}</p>}<div className="mt-3 flex items-center justify-between gap-3"><p className="text-xs text-slate-500">Read-only mode — it will never change CRM records.</p><button type="submit" disabled={!prompt.trim() || isSending} className="rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300">{isSending ? "Thinking…" : "Send"}</button></div></form></div></div>;
}
