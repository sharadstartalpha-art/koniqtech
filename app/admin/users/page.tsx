"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";

type User = {
  id: string;
  email: string;
  hasAccess: boolean;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  /* =========================
     LOAD USERS
  ========================= */
  const load = async () => {
    try {
      const res = await axios.get("/api/admin/users");
      setUsers(res.data);
    } catch {
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
    load();
  }, []);

  /* =========================
     GIVE ACCESS
  ========================= */
  const giveAccess = async (userId: string) => {
    try {
      setLoadingId(userId);

      await axios.post("/api/admin/give-access", {
        userId,
        productId: "invoice-recovery",
      });

      toast.success("Access granted");

      await load(); // 🔥 ensure fresh data

    } catch {
      toast.error("Failed to grant access");
    } finally {
      setLoadingId(null);
    }
  };

  /* =========================
     FILTER + SEARCH
  ========================= */
  const filtered = useMemo(() => {
    return users.filter((u) =>
      u.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  /* =========================
     PAGINATION
  ========================= */
  const totalPages = Math.ceil(filtered.length / limit);

  const paginated = filtered.slice(
    (page - 1) * limit,
    page * limit
  );

  /* =========================
     UI
  ========================= */
  return (
    <div className="space-y-4">

      <h1 className="text-lg font-semibold">Users</h1>

      {/* SEARCH + LIMIT */}
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border px-3 py-2 rounded-md text-sm"
        />

        <select
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
          className="border px-2 py-2 rounded-md text-sm"
        >
          <option value={5}>5 / page</option>
          <option value={10}>10 / page</option>
          <option value={20}>20 / page</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-md overflow-hidden">

        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((u, i) => (
              <tr key={u.id} className="border-t">

                {/* SERIAL NUMBER */}
                <td className="p-3">
                  {(page - 1) * limit + i + 1}
                </td>

                <td className="p-3">{u.email}</td>

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

        {/* EMPTY STATE */}
        {paginated.length === 0 && (
          <div className="p-4 text-center text-gray-400">
            No users found
          </div>
        )}

      </div>

      {/* PAGINATION CONTROLS */}
      <div className="flex justify-between items-center text-sm">

        <span>
          Page {page} of {totalPages || 1}
        </span>

        <div className="space-x-2">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages || totalPages === 0}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
}