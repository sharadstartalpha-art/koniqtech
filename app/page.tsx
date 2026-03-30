"use client";

import { useSession, signIn } from "next-auth/react";

export default function Home() {
  const sessionData = useSession();
const data = sessionData?.data;

  return (
    <div className="text-center mt-20">
      {!data ? (
        <>
          <h1 className="text-3xl font-bold mb-4">
            AI Lead Finder SaaS
          </h1>

          <button
            onClick={() => signIn("github")}
            className="bg-black text-white px-6 py-3 rounded"
          >
            Login with GitHub
          </button>
        </>
      ) : (
        <a
          href="/dashboard"
          className="bg-black text-white px-6 py-3 rounded"
        >
          Go to Dashboard
        </a>
      )}
    </div>
  );
}


