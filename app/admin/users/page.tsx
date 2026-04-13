"use client";

import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  async function loadUsers() {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function updateUser(userId: string, action: string, value?: any) {
    if (!confirm(`Are you sure to ${action}?`)) return;

    await fetch("/api/admin/user", {
      method: "POST",
      body: JSON.stringify({ userId, action, value }),
    });

    alert("Updated successfully");
    loadUsers();
  }

  async function addCredits(userId: string) {
    if (!confirm("Add 100 credits?")) return;

    await fetch("/api/admin/credits", {
      method: "POST",
      body: JSON.stringify({ userId, amount: 100 }),
    });

    alert("Credits added successfully");
    loadUsers();
  }

  const filtered = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Users 👥</h1>

      {/* SEARCH */}
      <input
        placeholder="Search user..."
        className="border px-3 py-2 mb-4 rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="w-full border rounded-xl overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">#</th>
            <th>Email</th>
            <th>Role</th>
            <th>Plan</th>
            <th>Credits</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((u, i) => (
            <tr key={u.id} className="border-t text-center">
              <td>{i + 1}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.plan}</td>
              <td>{u.credits || 0}</td>

              <td className="flex gap-2 justify-center p-2">

                <button
                  onClick={() => addCredits(u.id)}
                  className="bg-purple-500 text-white px-2 py-1 rounded"
                >
                  +100
                </button>

                <button
                  onClick={() => updateUser(u.id, "role", "ADMIN")}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Admin
                </button>

                <button
                  onClick={() =>
                    updateUser(u.id, u.isBanned ? "unban" : "ban")
                  }
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  {u.isBanned ? "Unban" : "Ban"}
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}