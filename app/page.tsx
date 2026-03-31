"use client";

import { useSession, signIn } from "next-auth/react";

export default function Home() {
  const { data } = useSession();

  return (
    <div className="text-center mt-32">
      {!data ? (
        <>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-black to-gray-500 text-transparent bg-clip-text">
            AI Lead Finder SaaS
          </h1>

          <p className="text-gray-600 mb-8">
            Find high-quality leads in seconds using AI.
          </p>

          <button
            onClick={() => signIn("github")}
            className="bg-black text-white px-6 py-3 rounded-lg"
          >
            Login with GitHub
          </button>
        </>
      ) : (
        <a
          href="/dashboard"
          className="bg-black text-white px-6 py-3 rounded-lg"
        >
          Go to Dashboard
        </a>
      )}
    </div>
  );
}