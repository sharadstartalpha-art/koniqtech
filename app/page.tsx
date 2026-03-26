import { getServerSession } from "next-auth"
import { authOptions } from "../lib/auth"

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return <div className="p-10">Not logged in</div>
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Welcome</h1>
      <p>{session.user?.email}</p>

      <a
        href="/dashboard"
        className="inline-block mt-4 bg-black text-white px-4 py-2 rounded"
      >
        Go to Dashboard
      </a>
    </div>
  )
}