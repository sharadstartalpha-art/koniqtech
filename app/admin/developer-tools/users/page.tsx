"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import {
  Users,
  User,
  Shield,
  Search,
  RefreshCw,
  Plus,
  Eye,
  LogIn,
  KeyRound,
  Ban,
  CheckCircle2,
  MoreHorizontal,
  Mail,
} from "lucide-react";

type UserRole =
  | "Owner"
  | "Manager"
  | "Sales"
  | "Dispatcher"
  | "Technician";

type UserStatus =
  | "Active"
  | "Invited"
  | "Suspended";

interface UserRecord {
  id: string;

  name: string;

  email: string;

  organization: string;

  role: UserRole;

  status: UserStatus;

  lastLogin: string;

  createdAt: string;
}

const users: UserRecord[] = [
  {
    id: "user_001",
    name: "John Carter",
    email: "john@abcroofing.com",
    organization: "ABC Roofing",
    role: "Owner",
    status: "Active",
    lastLogin: "10 minutes ago",
    createdAt: "2026-07-01",
  },
  {
    id: "user_002",
    name: "Michael Ross",
    email: "michael@elitehvac.com",
    organization: "Elite HVAC",
    role: "Manager",
    status: "Invited",
    lastLogin: "-",
    createdAt: "2026-07-15",
  },
  {
    id: "user_003",
    name: "Sarah Smith",
    email: "sarah@primeplumbing.com",
    organization: "Prime Plumbing",
    role: "Sales",
    status: "Active",
    lastLogin: "Yesterday",
    createdAt: "2026-06-20",
  },
  {
    id: "user_004",
    name: "David Lee",
    email: "david@greenlandscape.com",
    organization: "Green Landscape",
    role: "Technician",
    status: "Suspended",
    lastLogin: "3 weeks ago",
    createdAt: "2026-05-05",
  },
];

export default function DeveloperUsersPage() {

      const [search, setSearch] =
    useState("");

  const [roleFilter, setRoleFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [loading, setLoading] =
    useState(false);

  const [selectedUser, setSelectedUser] =
    useState<UserRecord | null>(null);

      const stats = useMemo(() => ({
    total: users.length,

    active: users.filter(
      (u) => u.status === "Active"
    ).length,

    invited: users.filter(
      (u) => u.status === "Invited"
    ).length,

    suspended: users.filter(
      (u) => u.status === "Suspended"
    ).length,

    owners: users.filter(
      (u) => u.role === "Owner"
    ).length,

    technicians: users.filter(
      (u) => u.role === "Technician"
    ).length,
  }), []);

    const filteredUsers =
    useMemo(() => {
      return users.filter((user) => {

        const matchesSearch =
          user.name
            .toLowerCase()
            .includes(search.toLowerCase()) ||

          user.email
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchesRole =
          roleFilter === "All" ||
          user.role === roleFilter;

        const matchesStatus =
          statusFilter === "All" ||
          user.status === statusFilter;

        return (
          matchesSearch &&
          matchesRole &&
          matchesStatus
        );

      });
    }, [
      search,
      roleFilter,
      statusFilter,
    ]);






      function refreshUsers() {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }

  function getRoleColor(
    role: UserRole
  ) {
    switch (role) {
      case "Owner":
        return "bg-amber-100 text-amber-700";

      case "Manager":
        return "bg-indigo-100 text-indigo-700";

      case "Sales":
        return "bg-blue-100 text-blue-700";

      case "Dispatcher":
        return "bg-purple-100 text-purple-700";

      case "Technician":
        return "bg-green-100 text-green-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  }


      const [actionLoading, setActionLoading] =
  useState(false);

const [successMessage, setSuccessMessage] =
  useState("");

const [errorMessage, setErrorMessage] =
  useState("");

const [showActions, setShowActions] =
  useState(false);

const [showDeleteModal, setShowDeleteModal] =
  useState(false);


  const [currentPage, setCurrentPage] =
  useState(1);

const pageSize = 10;

  async function loginAsUser(
  user: UserRecord
) {
  try {
    setActionLoading(true);

    // TODO:
    // POST /api/admin/developer-tools/login-as

    console.log(
      "Login As",
      user.email
    );

    setSuccessMessage(
      `Logged in as ${user.name}.`
    );
  } catch {
    setErrorMessage(
      "Unable to login as user."
    );
  } finally {
    setActionLoading(false);
  }
}


async function resetPassword(
  user: UserRecord
) {
  try {
    setActionLoading(true);

    // TODO:
    // POST /api/admin/users/reset-password

    setSuccessMessage(
      `Password reset email sent to ${user.email}.`
    );
  } catch {
    setErrorMessage(
      "Unable to reset password."
    );
  } finally {
    setActionLoading(false);
  }
}


async function suspendUser(
  user: UserRecord
) {
  try {
    setActionLoading(true);

    // TODO

    setSuccessMessage(
      `${user.name} suspended.`
    );
  } catch {
    setErrorMessage(
      "Unable to suspend user."
    );
  } finally {
    setActionLoading(false);
  }
}

async function activateUser(
  user: UserRecord
) {
  try {
    setActionLoading(true);

    // TODO

    setSuccessMessage(
      `${user.name} activated.`
    );
  } catch {
    setErrorMessage(
      "Unable to activate user."
    );
  } finally {
    setActionLoading(false);
  }
}

async function resendInvitation(
  user: UserRecord
) {
  try {
    setActionLoading(true);

    // TODO

    setSuccessMessage(
      `Invitation sent to ${user.email}.`
    );
  } catch {
    setErrorMessage(
      "Unable to resend invitation."
    );
  } finally {
    setActionLoading(false);
  }
}


async function deleteUser(
  user: UserRecord
) {
  try {
    setActionLoading(true);

    // TODO

    setSuccessMessage(
      `${user.name} deleted.`
    );
  } catch {
    setErrorMessage(
      "Unable to delete user."
    );
  } finally {
    setActionLoading(false);
  }
}

const totalPages = Math.max(
  1,
  Math.ceil(
    filteredUsers.length /
      pageSize
  )
);

const paginatedUsers =
  filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

    return (
    <div className="space-y-8">

     {successMessage && (
  <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
    {successMessage}
  </div>
)}

{errorMessage && (
  <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
    {errorMessage}
  </div>
)}

      {/* Header */}

      <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-xl">

        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

          <div>

            <div className="mb-4 flex items-center gap-4">

              <div className="rounded-2xl bg-white/10 p-4">

                <Users className="h-8 w-8" />

              </div>

              <div>

                <h1 className="text-4xl font-bold">
                  User Testing
                </h1>

                <p className="mt-2 text-slate-300">
                  Test users, permissions, roles and Login-As functionality.
                </p>

              </div>

            </div>

          </div>

          <div className="flex flex-wrap gap-3">

            <button
              onClick={refreshUsers}
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 font-medium transition hover:bg-white/20"
            >
              <RefreshCw
                className={`h-5 w-5 ${
                  loading ? "animate-spin" : ""
                }`}
              />

              Refresh

            </button>

            <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-700">

              <Plus className="h-5 w-5" />

              New User

            </button>

          </div>

        </div>

      </section>

      {/* Statistics */}

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-6">

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <Users className="mb-4 h-8 w-8 text-blue-600" />

          <p className="text-sm text-slate-500">
            Total Users
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {stats.total}
          </h3>

        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <CheckCircle2 className="mb-4 h-8 w-8 text-green-600" />

          <p className="text-sm text-slate-500">
            Active
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {stats.active}
          </h3>

        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <Mail className="mb-4 h-8 w-8 text-blue-600" />

          <p className="text-sm text-slate-500">
            Invited
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {stats.invited}
          </h3>

        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <Ban className="mb-4 h-8 w-8 text-red-600" />

          <p className="text-sm text-slate-500">
            Suspended
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {stats.suspended}
          </h3>

        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <Shield className="mb-4 h-8 w-8 text-amber-600" />

          <p className="text-sm text-slate-500">
            Owners
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {stats.owners}
          </h3>

        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <User className="mb-4 h-8 w-8 text-indigo-600" />

          <p className="text-sm text-slate-500">
            Technicians
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {stats.technicians}
          </h3>

        </div>

      </section>

      {/* Filters */}

      <section className="rounded-2xl border bg-white p-6 shadow-sm">

        <div className="grid gap-4 lg:grid-cols-4">

          <div className="relative">

            <Search className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search user..."
              className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none focus:border-blue-500"
            />

          </div>

          <select
            value={roleFilter}
            onChange={(e) =>
              setRoleFilter(e.target.value)
            }
            className="rounded-xl border border-slate-300 px-4 py-3"
          >
            <option>All</option>
            <option>Owner</option>
            <option>Manager</option>
            <option>Sales</option>
            <option>Dispatcher</option>
            <option>Technician</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="rounded-xl border border-slate-300 px-4 py-3"
          >
            <option>All</option>
            <option>Active</option>
            <option>Invited</option>
            <option>Suspended</option>
          </select>

          <button className="inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 transition hover:bg-slate-100">

            <Search className="h-5 w-5" />

            Search

          </button>

        </div>

      </section>

      {/* Users Table */}

         <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">

  <div className="overflow-x-auto">

    <table className="min-w-full">

      <thead className="bg-slate-50">

        <tr>

          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
            User
          </th>

          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
            Organization
          </th>

          <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
            Role
          </th>

          <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
            Status
          </th>

          <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
            Last Login
          </th>

          <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
            Created
          </th>

          <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">
            Actions
          </th>

        </tr>

      </thead>

      <tbody>

        {paginatedUsers.map((user) => (

          <tr
            key={user.id}
            className="border-t transition hover:bg-slate-50"
          >

            <td className="px-6 py-5">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">

                  {user.name.charAt(0)}

                </div>

                <div>

                  <p className="font-semibold">
                    {user.name}
                  </p>

                  <p className="text-sm text-slate-500">
                    {user.email}
                  </p>

                </div>

              </div>

            </td>

            <td className="px-6 py-5">

              <div>

                <p className="font-medium">
                  {user.organization}
                </p>

              </div>

            </td>

            <td className="px-6 py-5 text-center">

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${getRoleColor(
                  user.role
                )}`}
              >
                {user.role}
              </span>

            </td>

            <td className="px-6 py-5 text-center">

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                  user.status
                )}`}
              >
                {user.status}
              </span>

            </td>

            <td className="px-6 py-5 text-center text-slate-600">

              {user.lastLogin}

            </td>

            <td className="px-6 py-5 text-center text-slate-600">

              {user.createdAt}

            </td>

            <td className="px-6 py-5">

              <div className="flex justify-end gap-2">

                <Link
                  href={`/admin/users/${user.id}`}
                  className="rounded-lg border p-2 transition hover:bg-slate-100"
                  title="View User"
                >
                  <Eye className="h-4 w-4" />
                </Link>

                <button
             onClick={() =>
              loginAsUser(user)
                     }
           className="rounded-lg border p-2 transition hover:bg-blue-50">
            <LogIn className="h-4 w-4 text-blue-600" />
            </button>

                <button
  onClick={() =>
    resetPassword(user)
  }
  className="rounded-lg border p-2 transition hover:bg-amber-50"
>
  <KeyRound className="h-4 w-4 text-amber-600" />
</button>

                <button
  onClick={() =>
    suspendUser(user)
  }
  className="rounded-lg border p-2 transition hover:bg-red-50"
>
  <Ban className="h-4 w-4 text-red-600" />
</button>
                


                <button
  onClick={() => {
    setSelectedUser(user);
    setShowActions(true);
  }}
  className="rounded-lg border p-2 transition hover:bg-slate-100"
>
  <MoreHorizontal className="h-4 w-4" />
</button>

              </div>

            </td>

          </tr>

        ))}

        {filteredUsers.length === 0 && (

          <tr>

            <td
              colSpan={7}
              className="px-6 py-16 text-center"
            >

              <Users className="mx-auto mb-4 h-12 w-12 text-slate-300" />

              <h3 className="text-lg font-semibold">
                No users found
              </h3>

              <p className="mt-2 text-slate-500">
                Try adjusting your search or filters.
              </p>

            </td>

          </tr>

        )}

      </tbody>

    </table>



    {selectedUser &&
  showActions && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">

      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">

        <div className="border-b p-6">

          <h2 className="text-xl font-bold">
            {selectedUser.name}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Testing Actions
          </p>

        </div>

        <div className="space-y-3 p-6">

          <button
            onClick={() =>
              loginAsUser(selectedUser)
            }
            className="w-full rounded-xl bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700"
          >
            Login As User
          </button>

          <button
            onClick={() =>
              resetPassword(
                selectedUser
              )
            }
            className="w-full rounded-xl bg-amber-500 px-4 py-3 font-medium text-white hover:bg-amber-600"
          >
            Reset Password
          </button>

          <button
            onClick={() =>
              activateUser(
                selectedUser
              )
            }
            className="w-full rounded-xl bg-green-600 px-4 py-3 font-medium text-white hover:bg-green-700"
          >
            Activate
          </button>

          <button
            onClick={() =>
              suspendUser(
                selectedUser
              )
            }
            className="w-full rounded-xl bg-red-600 px-4 py-3 font-medium text-white hover:bg-red-700"
          >
            Suspend
          </button>

          <button
            onClick={() =>
              resendInvitation(
                selectedUser
              )
            }
            className="w-full rounded-xl border px-4 py-3"
          >
            Resend Invitation
          </button>

          <button
            onClick={() => {
              setShowActions(false);
              setShowDeleteModal(true);
            }}
            className="w-full rounded-xl border border-red-200 px-4 py-3 text-red-600 hover:bg-red-50"
          >
            Delete User
          </button>

        </div>

        <div className="border-t p-6">

          <button
            onClick={() =>
              setShowActions(false)
            }
            className="w-full rounded-xl border px-4 py-3"
          >
            Close
          </button>

        </div>

      </div>

    </div>
)}


{showDeleteModal &&
  selectedUser && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">

      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">

        <div className="border-b p-6">

          <h2 className="text-xl font-bold text-red-600">
            Delete User
          </h2>

          <p className="mt-3 text-slate-600">
            Delete

            <strong>

              {" "}

              {selectedUser.name}

            </strong>

            ?

          </p>

        </div>

        <div className="flex justify-end gap-3 p-6">

          <button
            onClick={() =>
              setShowDeleteModal(
                false
              )
            }
            className="rounded-xl border px-4 py-2"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              deleteUser(
                selectedUser
              );

              setShowDeleteModal(
                false
              );

              setShowActions(
                false
              );
            }}
            className="rounded-xl bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Delete
          </button>

        </div>

      </div>

    </div>
)}


<section className="flex items-center justify-between rounded-2xl border bg-white p-5">

  <p className="text-sm text-slate-500">

    Showing

    {" "}

    {paginatedUsers.length}

    {" "}

    of

    {" "}

    {filteredUsers.length}

    users

  </p>

  <div className="flex gap-2">

    <button
      disabled={currentPage === 1}
      onClick={() =>
        setCurrentPage((page) =>
          Math.max(
            1,
            page - 1
          )
        )
      }
      className="rounded-lg border px-4 py-2 disabled:opacity-50"
    >
      Previous
    </button>

    <span className="rounded-lg border bg-slate-50 px-4 py-2">

      {currentPage}

      /

      {totalPages}

    </span>

    <button
      disabled={
        currentPage ===
        totalPages
      }
      onClick={() =>
        setCurrentPage((page) =>
          Math.min(
            totalPages,
            page + 1
          )
        )
      }
      className="rounded-lg border px-4 py-2 disabled:opacity-50"
    >
      Next
    </button>

  </div>

</section>

  </div>

         </section>







         </div>

         );
         }

  function getStatusColor(
    status: UserStatus
  ) {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";

      case "Invited":
        return "bg-blue-100 text-blue-700";

      case "Suspended":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  }