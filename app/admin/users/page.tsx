"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const load = async () => {
    const res = await axios.get("/api/admin/users");
    setUsers(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const giveAccess = async (userId: string) => {
    try {
      setLoadingId(userId);

      await axios.post("/api/admin/give-access", {
        userId,
        productId: "invoice-recovery",
      });

      toast.success("Access granted");

      load();
    } catch {
      toast.error("Failed to grant access");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">

      <h1 className="text-lg font-semibold">Users</h1>

      <div className="bg-white border rounded-md overflow-hidden">

        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Status</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">

                <td className="p-3">{u.email}</td>

                {/* STATUS */}
                <td className="p-3">
                  {u.hasAccess ? (
                    <span className="text-green-600 text-xs font-medium">
                      Active
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs">
                      No Access
                    </span>
                  )}
                </td>

                {/* ACTION */}
                <td className="p-3 text-right">
                  {!u.hasAccess && (
                    <button
                      onClick={() => giveAccess(u.id)}
                      disabled={loadingId === u.id}
                      className="text-xs border px-3 py-1 rounded-md hover:bg-gray-50 disabled:opacity-50"
                    >
                      {loadingId === u.id
                        ? "Giving..."
                        : "Give Access"}
                    </button>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}