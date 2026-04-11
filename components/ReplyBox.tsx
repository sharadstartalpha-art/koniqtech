"use client";

import { useState } from "react";

export function ReplyBox({ threadId, to }: { threadId: string; to: string }) {
  const [message, setMessage] = useState("");

  const sendReply = async () => {
    await fetch("/api/inbox/reply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ threadId, message, to }),
    });

    // ✅ STOP SEQUENCE USING "to"
    await fetch("/api/sequences/stop", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: to }),
    });

    setMessage("");
    location.reload();
  };

  return (
    <div className="mt-4 border-t pt-4">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full border p-2 rounded"
        placeholder="Write reply..."
      />

      <button
        onClick={sendReply}
        className="mt-2 bg-black text-white px-4 py-2 rounded"
      >
        Send Reply
      </button>
    </div>
  );
}