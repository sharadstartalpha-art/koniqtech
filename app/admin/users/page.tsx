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
  plan?: {
    id: string;
    name: string;
  } | null;
  expiresAt?: string | null;
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

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [loadingId, setLoadingId] = useState<string | null>(null);

  /* MODAL */
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedPlan, setSelectedPlan] = useState("");

  /* =========================
     LOAD DATA
  ========================= */
  const load = async () => {
    try {
      const res = await axios.get("/api/admin/users", {
  headers: { "Cache-Control": "no-cache" },
});
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
     GIVE / CHANGE PLAN
  ========================= */
  const saveAccess = async () => {
    try {
      if (!selectedUser || !selectedPlan) {
        toast.error("Select a plan");
        return;
      }

      setLoadingId(selectedUser.id);

      await axios.post("/api/admin/give-access", {
        userId: selectedUser.id,
        productId: "invoice-recovery",
        planId: selectedPlan,
      });

      toast.success("Plan updated");

      setSelectedUser(null);
      setSelectedPlan("");

      await load();
    } catch {
      toast.error("Failed");
    } finally {
      setLoadingId(null);
    }
  };

  /* =========================
     REVOKE ACCESS
  ========================= */
  const revokeAccess = async (userId: string) => {
    try {
      setLoadingId(userId);

      await axios.post("/api/admin/revoke-access", {
        userId,
        productId: "invoice-recovery",
      });

      toast.success("Access revoked");
      await load();
    } catch {
      toast.error("Failed");
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
     FORMAT DATE
  ========================= */
  const formatDate = (date?: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString();
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="space-y-4">

      <h1 className="text-lg font-semibold">Users</h1>

      {/* SEARCH */}
      <div className="flex justify-between">
        <input
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
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Plan</th>
              <th className="p-3 text-left">Expiry</th>
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

                {/* PLAN */}
                <td className="p-3">
                  {u.plan?.name || "-"}
                </td>

                {/* EXPIRY */}
                <td className="p-3">
                  {formatDate(u.expiresAt)}
                </td>

                {/* STATUS */}
                <td className="p-3">
                  {u.hasAccess ? (
                    <span className="text-green-600 text-xs">Active</span>
                  ) : (
                    <span className="text-gray-400 text-xs">No Access</span>
                  )}
                </td>

                {/* ACTIONS */}
                <td className="p-3 text-right space-x-2">

                  {/* GIVE / CHANGE */}
                  <button
                    onClick={() => {
                      setSelectedUser(u);
                      setSelectedPlan(u.plan?.id || "");
                    }}
                    className="text-xs border px-3 py-1 rounded"
                  >
                    {u.hasAccess ? "Change Plan" : "Give Access"}
                  </button>

                  {/* REVOKE */}
                  {u.hasAccess && (
                    <button
                      onClick={() => revokeAccess(u.id)}
                      disabled={loadingId === u.id}
                      className="text-xs border px-3 py-1 rounded text-red-500"
                    >
                      Revoke
                    </button>
                  )}

                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between text-sm">
        <span>Page {page} of {totalPages || 1}</span>

        <div className="space-x-2">
          <button
            onClick={() => setPage(p => p - 1)}
            disabled={page === 1}
            className="border px-3 py-1 rounded"
          >
            Prev
          </button>

          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page === totalPages}
            className="border px-3 py-1 rounded"
          >
            Next
          </button>
        </div>
      </div>

      {/* =========================
         MODAL
      ========================= */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-80">

            <h2 className="font-semibold mb-4">
              Select Plan
            </h2>

            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className="w-full border p-2 mb-4"
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
                onClick={() => setSelectedUser(null)}
                className="border px-3 py-1"
              >
                Cancel
              </button>

              <button
                onClick={saveAccess}
                className="bg-black text-white px-3 py-1 rounded"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}