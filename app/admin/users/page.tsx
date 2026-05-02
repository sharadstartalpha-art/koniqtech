"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";

/* =========================
   TYPES
========================= */
type User = {
  id: string;
  email: string;
  hasAccess: boolean;
};

type Plan = {
  id: string;
  name: string;
};

/* =========================
   COMPONENT
========================= */
export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);

  const [loadingId, setLoadingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  /* MODAL STATE */
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState("");

  /* =========================
     LOAD USERS + PLANS
  ========================= */
  const load = async () => {
    try {
      const res = await axios.get("/api/admin/users");
      setUsers(res.data);
    } catch {
      toast.error("Failed to load users");
    }
  };

  const loadPlans = async () => {
    try {
      const res = await axios.get("/api/plans/invoice-recovery");
      setPlans(res.data);
    } catch {
      toast.error("Failed to load plans");
    }
  };

  useEffect(() => {
    load();
    loadPlans();
  }, []);

  /* =========================
     GIVE ACCESS (WITH PLAN)
  ========================= */
  const giveAccess = async (userId: string) => {
    try {
      if (!selectedPlan) {
        toast.error("Select a plan");
        return;
      }

      setLoadingId(userId);

      await axios.post("/api/admin/give-access", {
        userId,
        productId: "invoice-recovery",
        planId: selectedPlan, // 🔥 IMPORTANT
      });

      toast.success("Access granted");

      setSelectedUser(null);
      setSelectedPlan("");

      await load();

    } catch {
      toast.error("Failed to grant access");
    } finally {
      setLoadingId(null);
    }
  };

  /* =========================
     FILTER
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
                      onClick={() => setSelectedUser(u.id)}
                      className="text-xs border px-3 py-1 rounded-md hover:bg-gray-50"
                    >
                      Give Access
                    </button>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        {/* EMPTY */}
        {paginated.length === 0 && (
          <div className="p-4 text-center text-gray-400">
            No users found
          </div>
        )}
      </div>

      {/* PAGINATION */}
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

      {/* =========================
         🔥 PLAN MODAL
      ========================= */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-80">

            <h2 className="text-lg font-semibold mb-4">
              Select Plan
            </h2>

            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            >
              <option value="">Choose plan</option>
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setSelectedPlan("");
                }}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={() => giveAccess(selectedUser)}
                className="px-3 py-1 bg-black text-white rounded"
              >
                Confirm
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}