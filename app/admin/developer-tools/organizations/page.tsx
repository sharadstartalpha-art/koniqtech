"use client";

import { useMemo, useState } from "react";

import Link from "next/link";

import {
  Building2,
  Crown,
  Search,
  Filter,
  RefreshCw,
  Plus,
  Eye,
  Users,
  CreditCard,
  Database,
  Shield,
  LogIn,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Clock3,
} from "lucide-react";


type OrganizationPlan =
  | "Starter"
  | "Professional"
  | "Enterprise";

type OrganizationStatus =
  | "Active"
  | "Trial"
  | "Suspended";

interface Organization {
  id: string;

  name: string;

  slug: string;

  owner: string;

  email: string;

  industry: string;

  users: number;

  plan: OrganizationPlan;

  status: OrganizationStatus;

  createdAt: string;

  trialEnds: string;

  monthlyRevenue: number;
}


const organizations: Organization[] = [
  {
    id: "org_001",
    name: "ABC Roofing",

    slug: "abc-roofing",

    owner: "John Carter",

    email: "john@abcroofing.com",

    industry: "Roofing",

    users: 6,

    plan: "Starter",

    status: "Active",

    createdAt: "2026-07-12",

    trialEnds: "2026-08-12",

    monthlyRevenue: 99,
  },

  {
    id: "org_002",

    name: "Elite HVAC",

    slug: "elite-hvac",

    owner: "Michael Ross",

    email: "michael@elitehvac.com",

    industry: "HVAC",

    users: 14,

    plan: "Professional",

    status: "Trial",

    createdAt: "2026-07-20",

    trialEnds: "2026-08-20",

    monthlyRevenue: 249,
  },

  {
    id: "org_003",

    name: "Prime Plumbing",

    slug: "prime-plumbing",

    owner: "Sarah Smith",

    email: "sarah@primeplumbing.com",

    industry: "Plumbing",

    users: 37,

    plan: "Enterprise",

    status: "Active",

    createdAt: "2026-06-01",

    trialEnds: "-",

    monthlyRevenue: 599,
  },

  {
    id: "org_004",

    name: "Green Landscape",

    slug: "green-landscape",

    owner: "David Lee",

    email: "david@greenlandscape.com",

    industry: "Landscaping",

    users: 9,

    plan: "Starter",

    status: "Suspended",

    createdAt: "2026-05-18",

    trialEnds: "-",

    monthlyRevenue: 99,
  },
];


export default function OrganizationsPage() {

    const [search, setSearch] =
    useState("");

  const [planFilter, setPlanFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [industryFilter, setIndustryFilter] =
    useState("All");

      const [loading, setLoading] =
         useState(false);



         const [showDeleteModal, setShowDeleteModal] =
          useState(false);

         const [showActions, setShowActions] =
            useState(false);

           const [currentPage, setCurrentPage] =
          useState(1);

          const pageSize = 10;

      const stats = useMemo(() => {
    return {
      total:
        organizations.length,

      active:
        organizations.filter(
          (o) =>
            o.status === "Active"
        ).length,

      starter:
        organizations.filter(
          (o) =>
            o.plan === "Starter"
        ).length,

      professional:
        organizations.filter(
          (o) =>
            o.plan ===
            "Professional"
        ).length,

      enterprise:
        organizations.filter(
          (o) =>
            o.plan ===
            "Enterprise"
        ).length,

      revenue:
        organizations.reduce(
          (sum, org) =>
            sum +
            org.monthlyRevenue,
          0
        ),
    };
     }, []);

    const filteredOrganizations =
    useMemo(() => {
      return organizations.filter(
        (organization) => {
          const matchesSearch =
            organization.name
              .toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||
            organization.email
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchesPlan =
            planFilter === "All" ||
            organization.plan ===
              planFilter;

          const matchesStatus =
            statusFilter === "All" ||
            organization.status ===
              statusFilter;

          const matchesIndustry =
            industryFilter ===
              "All" ||
            organization.industry ===
              industryFilter;

          return (
            matchesSearch &&
            matchesPlan &&
            matchesStatus &&
            matchesIndustry
          );
        }
      );
    }, [
      search,
      planFilter,
      statusFilter,
      industryFilter,
    ]);


     const [selectedOrganization, setSelectedOrganization] =
      useState<Organization | null>(null);

       const [actionLoading, setActionLoading] =
      useState(false);

     const [successMessage, setSuccessMessage] =
      useState("");

      const [errorMessage, setErrorMessage] =
     useState("");



       async function activateOrganization(
  organization: Organization
) {
  try {
    setActionLoading(true);

    // TODO:
    // await fetch("/api/admin/organizations/activate")

    setSuccessMessage(
      `${organization.name} activated successfully.`
    );
  } catch {
    setErrorMessage(
      "Unable to activate organization."
    );
  } finally {
    setActionLoading(false);
  }
            }

        async function suspendOrganization(
  organization: Organization
) {
  try {
    setActionLoading(true);

    // TODO

    setSuccessMessage(
      `${organization.name} suspended successfully.`
    );
  } catch {
    setErrorMessage(
      "Unable to suspend organization."
    );
  } finally {
    setActionLoading(false);
  }
          }


          async function changePlan(
  organization: Organization,
  plan: OrganizationPlan
) {
  try {
    setActionLoading(true);

    // TODO

    setSuccessMessage(
      `${organization.name} moved to ${plan}.`
    );
  } catch {
    setErrorMessage(
      "Unable to change plan."
    );
  } finally {
    setActionLoading(false);
  }
         }
           
         async function loginAs(
  organization: Organization
) {
  // TODO

  console.log(
    "Login as",
    organization.name
  );
         }
            
         async function generateDemoData(
  organization: Organization
) {
  // TODO

  console.log(
    "Generate demo",
    organization.name
  );
           }
          
          async function openBilling(
  organization: Organization
) {
  // TODO

  console.log(
    "Billing",
    organization.name
  );
           
          }
           async function deleteOrganization(
  organization: Organization
) {
  try {
    setActionLoading(true);

    // TODO

    setSuccessMessage(
      `${organization.name} deleted.`
    );
  } catch {
    setErrorMessage(
      "Unable to delete organization."
    );
  } finally {
    setActionLoading(false);
  }
          }





          const totalPages = Math.max(
           1,
  Math.ceil(
    filteredOrganizations.length /
      pageSize
  )
          );

          const paginatedOrganizations =
            filteredOrganizations.slice(
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

      <section className="rounded-3xl border bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-xl">

        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

          <div>

            <div className="mb-4 flex items-center gap-3">

              <div className="rounded-xl bg-white/10 p-3">
                <Building2 className="h-8 w-8" />
              </div>

              <div>

                <h1 className="text-4xl font-bold">
                  Organizations
                </h1>

                <p className="mt-2 text-slate-300">
                  Manage organizations, subscriptions, plans and testing
                  environments.
                </p>

              </div>

            </div>

          </div>

          <div className="flex flex-wrap gap-3">

            <button
              onClick={refreshOrganizations}
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

              New Organization

            </button>

          </div>

        </div>

      </section>

      {/* Statistics */}

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-6">

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <Building2 className="mb-4 h-8 w-8 text-blue-600" />

          <p className="text-sm text-slate-500">
            Organizations
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

          <Shield className="mb-4 h-8 w-8 text-slate-600" />

          <p className="text-sm text-slate-500">
            Starter
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {stats.starter}
          </h3>

        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <Users className="mb-4 h-8 w-8 text-indigo-600" />

          <p className="text-sm text-slate-500">
            Professional
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {stats.professional}
          </h3>

        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <Crown className="mb-4 h-8 w-8 text-amber-600" />

          <p className="text-sm text-slate-500">
            Enterprise
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {stats.enterprise}
          </h3>

        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <CreditCard className="mb-4 h-8 w-8 text-emerald-600" />

          <p className="text-sm text-slate-500">
            Revenue
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            ${stats.revenue}
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
              placeholder="Search organization..."
              className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none focus:border-blue-500"
            />

          </div>

          <select
            value={planFilter}
            onChange={(e) =>
              setPlanFilter(e.target.value)
            }
            className="rounded-xl border border-slate-300 px-4 py-3"
          >

            <option>All</option>
            <option>Starter</option>
            <option>Professional</option>
            <option>Enterprise</option>

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
            <option>Trial</option>
            <option>Suspended</option>

          </select>

          <select
            value={industryFilter}
            onChange={(e) =>
              setIndustryFilter(e.target.value)
            }
            className="rounded-xl border border-slate-300 px-4 py-3"
          >

            <option>All</option>
            <option>Roofing</option>
            <option>HVAC</option>
            <option>Plumbing</option>
            <option>Landscaping</option>

          </select>

        </div>

      </section>

      {/* Organizations Table */}


       <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">

    <div className="overflow-x-auto">

    <table className="min-w-full">

      <thead className="bg-slate-50">

        <tr>

          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
            Organization
          </th>

          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
            Plan
          </th>

          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
            Industry
          </th>

          <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
            Users
          </th>

          <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
            Status
          </th>

          <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
            Revenue
          </th>

          <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
            Trial Ends
          </th>

          <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">
            Actions
          </th>

        </tr>

      </thead>

      <tbody>



        {selectedOrganization &&
  showActions && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

        <h2 className="text-xl font-bold">
          {selectedOrganization.name}
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Organization Testing Actions
        </p>

        <div className="mt-6 space-y-3">

          <button
            onClick={() =>
              activateOrganization(
                selectedOrganization
              )
            }
            className="w-full rounded-xl bg-green-600 px-4 py-3 font-medium text-white hover:bg-green-700"
          >
            Activate
          </button>

          <button
            onClick={() =>
              suspendOrganization(
                selectedOrganization
              )
            }
            className="w-full rounded-xl bg-amber-500 px-4 py-3 font-medium text-white hover:bg-amber-600"
          >
            Suspend
          </button>

          <button
            onClick={() =>
              changePlan(
                selectedOrganization,
                "Starter"
              )
            }
            className="w-full rounded-xl border px-4 py-3"
          >
            Starter Plan
          </button>

          <button
            onClick={() =>
              changePlan(
                selectedOrganization,
                "Professional"
              )
            }
            className="w-full rounded-xl border px-4 py-3"
          >
            Professional Plan
          </button>

          <button
            onClick={() =>
              changePlan(
                selectedOrganization,
                "Enterprise"
              )
            }
            className="w-full rounded-xl border px-4 py-3"
          >
            Enterprise Plan
          </button>

          <button
            onClick={() => {
              setShowActions(false);
              setShowDeleteModal(true);
            }}
            className="w-full rounded-xl bg-red-600 px-4 py-3 font-medium text-white hover:bg-red-700"
          >
            Delete Organization
          </button>

        </div>

        <button
          onClick={() =>
            setShowActions(false)
          }
          className="mt-6 w-full rounded-xl border px-4 py-3"
        >
          Close
        </button>

      </div>

    </div>
)}
        {paginatedOrganizations.map((organization) => (

          <tr
            key={organization.id}
            className="border-t transition hover:bg-slate-50"
          >

            <td className="px-6 py-5">

              <div className="flex items-center gap-4">

                <div className="rounded-xl bg-blue-100 p-3">

                  <Building2 className="h-6 w-6 text-blue-600" />

                </div>

                <div>

                  <p className="font-semibold">
                    {organization.name}
                  </p>

                  <p className="text-sm text-slate-500">
                    {organization.email}
                  </p>

                  <p className="text-xs text-slate-400">
                    {organization.owner}
                  </p>

                </div>

              </div>

            </td>

            <td className="px-6 py-5">

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${getPlanColor(
                  organization.plan
                )}`}
              >
                {organization.plan}
              </span>

            </td>

            <td className="px-6 py-5">
              {organization.industry}
            </td>

            <td className="px-6 py-5 text-center">

              <span className="inline-flex items-center gap-2">

                <Users className="h-4 w-4 text-slate-500" />

                {organization.users}

              </span>

            </td>

            <td className="px-6 py-5 text-center">

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                  organization.status
                )}`}
              >
                {organization.status}
              </span>

            </td>

            <td className="px-6 py-5 text-center font-semibold text-emerald-600">

              ${organization.monthlyRevenue}

            </td>

            <td className="px-6 py-5 text-center">

              <span className="inline-flex items-center gap-2">

                <Clock3 className="h-4 w-4 text-slate-400" />

                {organization.trialEnds}

              </span>

            </td>

            <td className="px-6 py-5">

              <div className="flex justify-end gap-2">

  <Link
    href={`/admin/organizations/${organization.id}`}
    className="rounded-lg border p-2 hover:bg-slate-100"
    title="View"
  >
    <Eye className="h-4 w-4" />
  </Link>

  <button
    onClick={() =>
      loginAs(organization)
    }
    className="rounded-lg border p-2 hover:bg-blue-50"
    title="Login As"
  >
    <LogIn className="h-4 w-4 text-blue-600" />
  </button>

  <button
    onClick={() =>
      generateDemoData(
        organization
      )
    }
    className="rounded-lg border p-2 hover:bg-green-50"
    title="Generate Demo Data"
  >
    <Database className="h-4 w-4 text-green-600" />
  </button>

  <button
    onClick={() =>
      openBilling(
        organization
      )
    }
    className="rounded-lg border p-2 hover:bg-amber-50"
    title="Billing"
  >
    <CreditCard className="h-4 w-4 text-amber-600" />
  </button>

  <button
    onClick={() => {
  setSelectedOrganization(
    organization
  );

  setShowActions(true);
}}
    className="rounded-lg border p-2 hover:bg-slate-100"
    title="More Actions"
  >
    <MoreHorizontal className="h-4 w-4" />
  </button>


  {showDeleteModal &&
  selectedOrganization && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

      <div className="w-full max-w-md rounded-2xl bg-white p-6">

        <h2 className="text-xl font-bold text-red-600">
          Delete Organization
        </h2>

        <p className="mt-3 text-slate-600">
          Delete
          <strong>
            {" "}
            {selectedOrganization.name}
          </strong>
          ?
        </p>

        <div className="mt-6 flex justify-end gap-3">

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
              deleteOrganization(
                selectedOrganization
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

             </div>

            </td>

          </tr>

        ))}

        {filteredOrganizations.length === 0 && (

          <tr>

            <td
              colSpan={8}
              className="px-6 py-16 text-center"
            >

              <Building2 className="mx-auto mb-4 h-12 w-12 text-slate-300" />

              <h3 className="text-lg font-semibold">
                No organizations found
              </h3>

              <p className="mt-2 text-slate-500">
                Try changing your search or filters.
              </p>

            </td>

          </tr>

        )}

      </tbody>

    </table>



           <section className="flex items-center justify-between rounded-2xl border bg-white p-5">

  <p className="text-sm text-slate-500">

    Showing

    {" "}

    {paginatedOrganizations.length}

    {" "}

    of

    {" "}

    {filteredOrganizations.length}

    organizations

  </p>

  <div className="flex gap-2">

    <button
      disabled={currentPage === 1}
      onClick={() =>
        setCurrentPage((p) =>
          Math.max(1, p - 1)
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
        setCurrentPage((p) =>
          Math.min(
            totalPages,
            p + 1
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



    function refreshOrganizations() {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }

  function getStatusColor(
    status: OrganizationStatus
  ) {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";

      case "Trial":
        return "bg-blue-100 text-blue-700";

      case "Suspended":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  }

  function getPlanColor(
    plan: OrganizationPlan
  ) {
    switch (plan) {
      case "Starter":
        return "bg-slate-100 text-slate-700";

      case "Professional":
        return "bg-indigo-100 text-indigo-700";

      case "Enterprise":
        return "bg-amber-100 text-amber-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  }

  function setLoading(arg0: boolean) {
    throw new Error("Function not implemented.");
   }
