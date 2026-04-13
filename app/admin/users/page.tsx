"use client";

import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  async function updateUser(userId: string, action: string, value?: any) {
    await fetch("/api/admin/user", {
      method: "POST",
      body: JSON.stringify({ userId, action, value }),
    });

    location.reload();
  }

  async function addCredits(userId: string) {
    await fetch("/api/admin/credits", {
      method: "POST",
      body: JSON.stringify({ userId, amount: 100 }),
    });

    location.reload();
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Users 👥</h1>

      <table className="w-full border rounded-xl overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Email</th>
            <th>Role</th>
            <th>Plan</th>
            <th>Credits</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t">
              <td className="p-3">{u.email}</td>
              <td>{u.role}</td>
              <td>{u.plan}</td>
              <td>{u.credits || 0}</td>

              <td className="flex gap-2 p-2">

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
                  onClick={() => updateUser(u.id, u.isBanned ? "unban" : "ban")}
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