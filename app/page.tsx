"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

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

          <a
            href="/dashboard"
            className="block mb-4 text-blue-600 underline"
          >
            Go to Dashboard
          </a>

          <button
            onClick={() => signOut()}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
}