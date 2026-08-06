"use client";

import { useMemo, useState } from "react";
import {
  Shield,
  Search,
  User,
  Building2,
  CheckCircle2,
  Crown,
  Wrench,
  ClipboardList,
  Users,
  Calculator,
} from "lucide-react";

type Role =
  | "owner"
  | "manager"
  | "sales"
  | "dispatcher"
  | "technician"
  | "crew"
  | "accountant";

interface DemoUser {
  id: string;
  organization: string;
  industry: string;
  name: string;
  email: string;
  role: Role;
  plan: string;
}

const users: DemoUser[] = [
  {
    id: "1",
    organization: "Starter Roofing Demo",
    industry: "Roofing",
    name: "John Carter",
    email: "starter@koniqtech.com",
    role: "owner",
    plan: "Starter",
  },
  {
    id: "2",
    organization: "Professional HVAC Demo",
    industry: "HVAC",
    name: "Sarah Smith",
    email: "professional@koniqtech.com",
    role: "manager",
    plan: "Professional",
  },
  {
    id: "3",
    organization: "Enterprise Plumbing Demo",
    industry: "Plumbing",
    name: "Michael Lee",
    email: "enterprise@koniqtech.com",
    role: "dispatcher",
    plan: "Enterprise",
  },
];

const roleOptions: Role[] = [
  "owner",
  "manager",
  "sales",
  "dispatcher",
  "technician",
  "crew",
  "accountant",
];

function roleIcon(role: Role) {
  switch (role) {
    case "owner":
      return <Crown className="h-4 w-4 text-yellow-500" />;
    case "manager":
      return <Shield className="h-4 w-4 text-blue-600" />;
    case "sales":
      return <Users className="h-4 w-4 text-emerald-600" />;
    case "dispatcher":
      return <ClipboardList className="h-4 w-4 text-purple-600" />;
    case "technician":
      return <Wrench className="h-4 w-4 text-orange-600" />;
    case "crew":
      return <User className="h-4 w-4 text-slate-600" />;
    case "accountant":
      return <Calculator className="h-4 w-4 text-pink-600" />;
  }
}

export default function RoleSimulatorPage() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return users.filter((u) =>
      `${u.organization} ${u.email} ${u.name}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="space-y-8">

      <div className="rounded-2xl border bg-white p-8 shadow-sm">

        <div className="flex items-center gap-4">

          <div className="rounded-xl bg-indigo-600 p-3 text-white">
            <Shield className="h-7 w-7" />
          </div>

          <div>
            <h1 className="text-3xl font-bold">
              Role Simulator
            </h1>

            <p className="mt-2 text-slate-600">
              Preview every CRM role and verify menus,
              permissions and feature visibility without
              changing production users.
            </p>
          </div>

        </div>

        <div className="relative mt-8">

          <Search className="absolute left-4 top-4 h-5 w-5 text-slate-400" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search organization or user..."
            className="w-full rounded-xl border py-3 pl-12 pr-4 outline-none focus:border-blue-500"
          />

        </div>

      </div>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

        <table className="w-full">

          <thead className="bg-slate-50">

            <tr className="text-left text-sm text-slate-600">

              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Organization</th>
              <th className="px-6 py-4">Plan</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Preview Role</th>
              <th className="px-6 py-4">Action</th>

            </tr>

          </thead>

          <tbody>

            {filtered.map((user) => (

              <tr
                key={user.id}
                className="border-t hover:bg-slate-50"
              >

                <td className="px-6 py-5">

                  <div className="font-semibold">
                    {user.name}
                  </div>

                  <div className="text-sm text-slate-500">
                    {user.email}
                  </div>

                </td>

                <td className="px-6 py-5">

                  <div className="flex items-center gap-2">

                    <Building2 className="h-4 w-4 text-blue-600" />

                    <div>
                      <div>{user.organization}</div>
                      <div className="text-xs text-slate-500">
                        {user.industry}
                      </div>
                    </div>

                  </div>

                </td>

                <td className="px-6 py-5">

                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                    {user.plan}
                  </span>

                </td>

                <td className="px-6 py-5">

                  <div className="flex items-center gap-2 capitalize">

                    {roleIcon(user.role)}

                    {user.role}

                  </div>

                </td>

                <td className="px-6 py-5">

                  <select
                    defaultValue={user.role}
                    className="rounded-lg border px-3 py-2"
                  >
                    {roleOptions.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>

                </td>

                <td className="px-6 py-5">

                  <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
                    Preview
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <div className="grid gap-6 md:grid-cols-4">

        <div className="rounded-xl border bg-white p-6">
          <CheckCircle2 className="mb-3 h-8 w-8 text-green-600" />
          <p className="text-sm text-slate-500">Owners</p>
          <h2 className="mt-2 text-3xl font-bold">12</h2>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <Shield className="mb-3 h-8 w-8 text-blue-600" />
          <p className="text-sm text-slate-500">Managers</p>
          <h2 className="mt-2 text-3xl font-bold">24</h2>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <Users className="mb-3 h-8 w-8 text-emerald-600" />
          <p className="text-sm text-slate-500">Sales Users</p>
          <h2 className="mt-2 text-3xl font-bold">31</h2>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <Wrench className="mb-3 h-8 w-8 text-orange-600" />
          <p className="text-sm text-slate-500">Technicians</p>
          <h2 className="mt-2 text-3xl font-bold">87</h2>
        </div>

      </div>

      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">

        <h2 className="text-lg font-semibold text-blue-900">
          Recommended Testing Flow
        </h2>

        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-blue-800">
          <li>Select an organization.</li>
          <li>Choose a different role.</li>
          <li>Click <strong>Preview</strong>.</li>
          <li>Verify the left sidebar.</li>
          <li>Verify dashboard widgets.</li>
          <li>Verify page permissions.</li>
          <li>Verify API authorization.</li>
        </ol>

      </div>

    </div>
  );
}