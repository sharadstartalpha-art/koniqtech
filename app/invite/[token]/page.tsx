"use client";

import { useParams } from "next/navigation";

export default function InvitePage() {
  const { token } = useParams();

  const acceptInvite = async () => {
    await fetch("/api/team/accept", {
      method: "POST",
      body: JSON.stringify({ token }),
    });

    window.location.href = "/teams";
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">Join Team</h1>

      <button
        onClick={acceptInvite}
        className="bg-black text-white px-6 py-2 rounded"
      >
        Accept Invite
      </button>
    </div>
  );
}