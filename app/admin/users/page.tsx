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

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Users 👥</h1>

      <div className="space-y-3">
        {users.map((u) => (
          <div
            key={u.id}
            className="border p-4 rounded-xl flex justify-between items-center"
          >
            <div>
              <p>{u.email}</p>
              <p className="text-sm text-gray-500">
                {u.role} • {u.plan}
              </p>
            </div>

            <div className="flex gap-2">

              {/* BAN */}
              <button
                onClick={() => updateUser(u.id, u.isBanned ? "unban" : "ban")}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                {u.isBanned ? "Unban" : "Ban"}
              </button>

              {/* ROLE */}
              <button
                onClick={() => updateUser(u.id, "role", "ADMIN")}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                Make Admin
              </button>

              {/* PLAN */}
              <button
                onClick={() => updateUser(u.id, "plan", "PRO")}
                className="px-3 py-1 bg-green-500 text-white rounded"
              >
                Upgrade
              </button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}