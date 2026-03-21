import { getServerSession } from "next-auth";

export default async function Dashboard() {
  const session = await getServerSession();

  if (!session) {
    return <div className="p-10">Not logged in</div>;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p>Welcome {session.user?.name}</p>
      <p>{session.user?.email}</p>
    </main>
  );
}