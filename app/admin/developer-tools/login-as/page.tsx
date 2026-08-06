import Link from "next/link";
import {
  Search,
  User,
  Building2,
  Shield,
  Crown,
  ArrowRight,
} from "lucide-react";

const demoUsers = [
  {
    id: "1",
    organization: "Starter Demo Roofing",
    user: "starter@koniqtech.com",
    role: "Owner",
    plan: "Starter",
    industry: "Roofing",
    status: "Active",
  },
  {
    id: "2",
    organization: "Professional Demo HVAC",
    user: "professional@koniqtech.com",
    role: "Owner",
    plan: "Professional",
    industry: "HVAC",
    status: "Active",
  },
  {
    id: "3",
    organization: "Enterprise Demo Plumbing",
    user: "enterprise@koniqtech.com",
    role: "Owner",
    plan: "Enterprise",
    industry: "Plumbing",
    status: "Active",
  },
];

export default function LoginAsPage() {
  return (
    <div className="space-y-8">

      <div className="rounded-2xl border bg-white p-8 shadow-sm">

        <h1 className="text-3xl font-bold text-slate-900">
          Login As Customer
        </h1>

        <p className="mt-2 text-slate-600">
          Impersonate any customer account for testing.
          No password required.
        </p>

        <div className="relative mt-8">

          <Search className="absolute left-4 top-4 h-5 w-5 text-slate-400" />

          <input
            placeholder="Search organization, email or owner..."
            className="w-full rounded-xl border py-3 pl-12 pr-4 outline-none focus:border-blue-500"
          />

        </div>

      </div>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

        <table className="w-full">

          <thead className="bg-slate-50">

            <tr className="text-left text-sm text-slate-600">

              <th className="px-6 py-4">Organization</th>
              <th className="px-6 py-4">Owner</th>
              <th className="px-6 py-4">Plan</th>
              <th className="px-6 py-4">Industry</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4"></th>

            </tr>

          </thead>

          <tbody>

            {demoUsers.map((user) => (

              <tr
                key={user.id}
                className="border-t hover:bg-slate-50"
              >

                <td className="px-6 py-5">

                  <div className="flex items-center gap-3">

                    <div className="rounded-lg bg-blue-100 p-2">

                      <Building2 className="h-5 w-5 text-blue-600" />

                    </div>

                    <div>

                      <p className="font-semibold">
                        {user.organization}
                      </p>

                    </div>

                  </div>

                </td>

                <td className="px-6 py-5">

                  <div className="flex items-center gap-2">

                    <User className="h-4 w-4 text-slate-400" />

                    {user.user}

                  </div>

                </td>

                <td className="px-6 py-5">

                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                    {user.plan}
                  </span>

                </td>

                <td className="px-6 py-5">
                  {user.industry}
                </td>

                <td className="px-6 py-5">

                  <div className="flex items-center gap-2">

                    <Crown className="h-4 w-4 text-amber-500" />

                    {user.role}

                  </div>

                </td>

                <td className="px-6 py-5">

                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-700">
                    {user.status}
                  </span>

                </td>

                <td className="px-6 py-5 text-right">

                  <Link
                    href={`/admin/developer-tools/login-as/${user.id}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                  >
                    Login
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">

        <div className="flex items-center gap-3">

          <Shield className="h-6 w-6 text-amber-600" />

          <div>

            <p className="font-semibold text-amber-800">
              Super Admin Only
            </p>

            <p className="text-sm text-amber-700">
              All impersonation actions should be logged in the audit
              log with timestamp, admin user, IP address and target
              organization.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}