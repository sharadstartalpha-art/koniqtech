"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    axios.get("/api/admin/users").then((res) => {
      setUsers(res.data);
    });
  }, []);

  const giveAccess = async (userId: string) => {
    try {
      setLoading(userId);

      await axios.post("/api/admin/give-access", {
        userId,
        productId: "invoice-recovery",
      });

      alert("Access granted");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <h1 className="text-lg font-medium">Users</h1>

      {/* TABLE */}
      <div className="bg-white border border-gray-200 rounded-md overflow-hidden">

        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b text-gray-600">
            <tr>
              <th className="text-left px-4 py-2 font-medium">Email</th>
              <th className="text-right px-4 py-2 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{u.email}</td>

                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => giveAccess(u.id)}
                    disabled={loading === u.id}
                    className="text-xs border px-2 py-1 rounded-md hover:bg-gray-100"
                  >
                    {loading === u.id ? "Processing..." : "Give Access"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}