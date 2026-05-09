"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import toast from "react-hot-toast";

import {
  Search,
  ShieldCheck,
  Crown,
  Users,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

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
  const [users, setUsers] =
    useState<User[]>([]);

  const [plans, setPlans] =
    useState<Plan[]>([]);

  const [search, setSearch] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [limit, setLimit] =
    useState(10);

  const [loadingId, setLoadingId] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  /* MODAL */

  const [
    selectedUser,
    setSelectedUser,
  ] = useState<User | null>(null);

  const [
    selectedPlan,
    setSelectedPlan,
  ] = useState("");

  /* =========================
     LOAD USERS
  ========================= */

  const load = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "/api/admin/users",
        {
          headers: {
            "Cache-Control":
              "no-cache",
          },
        }
      );

      setUsers(res.data);

    } catch {
      toast.error(
        "Failed to load users"
      );

    } finally {
      setLoading(false);
    }
  };

  /* =========================
     LOAD PLANS
  ========================= */

  const loadPlans = async () => {
    try {
      const res = await axios.get(
        "/api/plans/invoice-recovery"
      );

      setPlans(res.data);

    } catch {
      toast.error(
        "Failed to load plans"
      );
    }
  };

  useEffect(() => {
    load();
    loadPlans();
  }, []);

  /* =========================
     SAVE ACCESS
  ========================= */

  const saveAccess = async () => {
    try {
      if (
        !selectedUser ||
        !selectedPlan
      ) {
        toast.error(
          "Select a plan"
        );

        return;
      }

      setLoadingId(
        selectedUser.id
      );

      await axios.post(
        "/api/admin/give-access",
        {
          userId:
            selectedUser.id,

          productId:
            "invoice-recovery",

          planId:
            selectedPlan,
        }
      );

      toast.success(
        "Plan updated"
      );

      setSelectedUser(null);

      setSelectedPlan("");

      await load();

    } catch {
      toast.error(
        "Failed to update plan"
      );

    } finally {
      setLoadingId(null);
    }
  };

  /* =========================
     REVOKE ACCESS
  ========================= */

  const revokeAccess = async (
    userId: string
  ) => {
    try {
      setLoadingId(userId);

      await axios.post(
        "/api/admin/revoke-access",
        {
          userId,

          productId:
            "invoice-recovery",
        }
      );

      toast.success(
        "Access revoked"
      );

      await load();

    } catch {
      toast.error(
        "Failed to revoke access"
      );

    } finally {
      setLoadingId(null);
    }
  };

  /* =========================
     FILTER
  ========================= */

  const filtered = useMemo(() => {
    return users.filter((u) =>
      u.email
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );
  }, [users, search]);

  /* =========================
     PAGINATION
  ========================= */

  const totalPages = Math.ceil(
    filtered.length / limit
  );

  const paginated =
    filtered.slice(
      (page - 1) * limit,
      page * limit
    );

  /* =========================
     FORMAT DATE
  ========================= */

  const formatDate = (
    date?: string | null
  ) => {
    if (!date) return "-";

    return new Date(
      date
    ).toLocaleDateString();
  };

  /* =========================
     UI
  ========================= */

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div className="flex items-center justify-between flex-wrap gap-4">

        <div>

          <h1 className="text-3xl font-bold text-gray-900">
            Users
          </h1>

          <p className="text-gray-500 mt-1">
            Manage customers,
            plans and subscriptions
          </p>

        </div>

        <div className="bg-white border rounded-2xl px-5 py-3 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">

              <Users size={22} />

            </div>

            <div>

              <p className="text-sm text-gray-500">
                Total Users
              </p>

              <h2 className="font-bold text-xl">
                {users.length}
              </h2>

            </div>

          </div>

        </div>

      </div>

      {/* SEARCH */}

      <div className="bg-white border rounded-3xl p-5 shadow-sm">

        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">

          <div className="relative w-full lg:max-w-md">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              placeholder="Search users by email..."
              value={search}
              onChange={(e) => {
                setSearch(
                  e.target.value
                );

                setPage(1);
              }}
              className="w-full border border-gray-200 bg-gray-50 rounded-2xl pl-11 pr-4 py-3 outline-none focus:border-orange-400 focus:bg-white transition"
            />

          </div>

          <select
            value={limit}
            onChange={(e) => {
              setLimit(
                Number(
                  e.target.value
                )
              );

              setPage(1);
            }}
            className="border border-gray-200 rounded-2xl px-4 py-3 bg-white"
          >
            <option value={10}>
              10 per page
            </option>

            <option value={20}>
              20 per page
            </option>

            <option value={50}>
              50 per page
            </option>

          </select>

        </div>

      </div>

      {/* TABLE */}

      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-50 border-b">

              <tr className="text-left">

                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                  User
                </th>

                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Plan
                </th>

                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Expiry
                </th>

                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Status
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-20 text-gray-400"
                  >
                    Loading users...
                  </td>
                </tr>

              ) : paginated.length ===
                0 ? (

                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-20 text-gray-400"
                  >
                    No users found
                  </td>
                </tr>

              ) : (
                paginated.map(
                  (u) => (
                    <tr
                      key={u.id}
                      className="border-b last:border-0 hover:bg-gray-50 transition"
                    >

                      {/* USER */}

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-4">

                          <div className="w-11 h-11 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-semibold">

                            {u.email
                              .charAt(
                                0
                              )
                              .toUpperCase()}

                          </div>

                          <div>

                            <p className="font-medium text-gray-900">
                              {
                                u.email
                              }
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                              ID:{" "}
                              {u.id.slice(
                                0,
                                8
                              )}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* PLAN */}

                      <td className="px-6 py-5">

                        {u.plan ? (
                          <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">

                            <Crown size={14} />

                            {
                              u.plan
                                .name
                            }

                          </div>

                        ) : (
                          <span className="text-gray-400 text-sm">
                            No Plan
                          </span>
                        )}

                      </td>

                      {/* EXPIRY */}

                      <td className="px-6 py-5 text-sm text-gray-600">

                        {formatDate(
                          u.expiresAt
                        )}

                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-5">

                        {u.hasAccess ? (
                          <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm font-medium">

                            <ShieldCheck
                              size={14}
                            />

                            Active

                          </div>

                        ) : (
                          <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-sm">

                            No Access

                          </div>
                        )}

                      </td>

                      {/* ACTIONS */}

                      <td className="px-6 py-5">

                        <div className="flex items-center justify-end gap-3">

                          <button
                            onClick={() => {
                              setSelectedUser(
                                u
                              );

                              setSelectedPlan(
                                u.plan
                                  ?.id ||
                                  ""
                              );
                            }}
                            className="px-4 py-2 rounded-xl bg-black text-white text-sm hover:opacity-90 transition"
                          >
                            {u.hasAccess
                              ? "Change Plan"
                              : "Give Access"}
                          </button>

                          {u.hasAccess && (
                            <button
                              onClick={() =>
                                revokeAccess(
                                  u.id
                                )
                              }
                              disabled={
                                loadingId ===
                                u.id
                              }
                              className="px-4 py-2 rounded-xl border border-red-200 text-red-500 text-sm hover:bg-red-50 transition"
                            >
                              Revoke
                            </button>
                          )}

                        </div>

                      </td>

                    </tr>
                  )
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* PAGINATION */}

      <div className="flex items-center justify-between">

        <p className="text-sm text-gray-500">
          Page {page} of{" "}
          {totalPages || 1}
        </p>

        <div className="flex items-center gap-2">

          <button
            onClick={() =>
              setPage((p) =>
                p - 1
              )
            }
            disabled={page === 1}
            className="w-10 h-10 rounded-xl border flex items-center justify-center disabled:opacity-40"
          >
            <ChevronLeft
              size={18}
            />
          </button>

          <button
            onClick={() =>
              setPage((p) =>
                p + 1
              )
            }
            disabled={
              page ===
              totalPages
            }
            className="w-10 h-10 rounded-xl border flex items-center justify-center disabled:opacity-40"
          >
            <ChevronRight
              size={18}
            />
          </button>

        </div>

      </div>

      {/* MODAL */}

      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">

          <div className="bg-white w-full max-w-md rounded-3xl p-7 shadow-2xl">

            <div className="flex items-start justify-between mb-6">

              <div>

                <h2 className="text-2xl font-bold text-gray-900">
                  Update Plan
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Change user subscription
                </p>

              </div>

              <button
                onClick={() =>
                  setSelectedUser(
                    null
                  )
                }
                className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center"
              >
                <X size={18} />
              </button>

            </div>

            <div className="mb-5">

              <p className="text-sm text-gray-500 mb-2">
                User
              </p>

              <div className="border rounded-2xl px-4 py-3 bg-gray-50 text-sm">
                {
                  selectedUser.email
                }
              </div>

            </div>

            <div>

              <p className="text-sm text-gray-500 mb-2">
                Select Plan
              </p>

              <select
                value={
                  selectedPlan
                }
                onChange={(e) =>
                  setSelectedPlan(
                    e.target
                      .value
                  )
                }
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-orange-400"
              >
                <option value="">
                  Choose plan
                </option>

                {plans.map(
                  (p) => (
                    <option
                      key={p.id}
                      value={
                        p.id
                      }
                    >
                      {p.name}
                    </option>
                  )
                )}

              </select>

            </div>

            <div className="flex justify-end gap-3 mt-8">

              <button
                onClick={() =>
                  setSelectedUser(
                    null
                  )
                }
                className="px-5 py-3 rounded-2xl border"
              >
                Cancel
              </button>

              <button
                onClick={
                  saveAccess
                }
                disabled={
                  loadingId ===
                  selectedUser.id
                }
                className="px-5 py-3 rounded-2xl bg-black text-white hover:opacity-90 transition"
              >
                {loadingId ===
                selectedUser.id
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}