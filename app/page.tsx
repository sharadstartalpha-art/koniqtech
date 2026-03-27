"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const sessionData = useSession();

  const session = sessionData?.data;

  return (
    <div className="p-10">
      {!session ? (
        <>
          <p className="mb-4">Not logged in</p>

          <button
            onClick={() => signIn("github")}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Login with GitHub
          </button>
        </>
      ) : (
        <>
          <p className="mb-4">
            Welcome {session.user?.email}
          </p>

          <a href="/dashboard" className="text-blue-600 underline">
            Go to Dashboard
          </a>

          <br />

          <button
            onClick={() => signOut()}
            className="mt-4 bg-gray-300 px-4 py-2 rounded"
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
}