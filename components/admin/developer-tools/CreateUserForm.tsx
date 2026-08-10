"use client";

import {
  FormEvent,
  useState,
} from "react";

import { useRouter } from "next/navigation";

type Organization = {
  id: string;
  name: string;
  crmType: string;
  plan: string;
  active: boolean;
};

type Props = {
  organizations: Organization[];
};

const ROLES = [
  {
    value: "owner",
    label: "Owner",
  },
  {
    value: "manager",
    label: "Manager",
  },
  {
    value: "sales",
    label: "Sales",
  },
  {
    value: "dispatcher",
    label: "Dispatcher",
  },
  {
    value: "technician",
    label: "Technician",
  },
  {
    value: "crew",
    label: "Crew",
  },
  {
    value: "accountant",
    label: "Accountant",
  },
];

const PLANS = [
  {
    value: "starter",
    label: "Starter",
    amount: 99,
  },
  {
    value: "professional",
    label: "Professional",
    amount: 199,
  },
  {
    value: "enterprise",
    label: "Enterprise",
    amount: 499,
  },
];

export default function CreateUserForm({
  organizations,
}: Props) {
  const router = useRouter();

  const [open, setOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    const form =
      new FormData(event.currentTarget);

    const payload = {
      orgId: String(
        form.get("orgId") ?? ""
      ),

      name: String(
        form.get("name") ?? ""
      ),

      email: String(
        form.get("email") ?? ""
      ),

      phone: String(
        form.get("phone") ?? ""
      ),

      password: String(
        form.get("password") ?? ""
      ),

      role: String(
        form.get("role") ?? ""
      ),

      plan: String(
        form.get("plan") ?? ""
      ),
    };

    try {
      const response =
        await fetch(
          "/api/admin/developer-tools/users",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(payload),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ??
            "Failed to create user."
        );
      }

      setSuccess(
        "User created successfully."
      );

      event.currentTarget.reset();

      router.refresh();

      setTimeout(() => {
        setOpen(false);
        setSuccess("");
      }, 1200);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError("");
          setSuccess("");
          setOpen(true);
        }}
        className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
      >
        + Create User
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-6 py-5">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Create CRM User
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Create a real user and assign
                  their organization subscription.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setOpen(false)
                }
                className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {success}
                </div>
              )}

              <div className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Organization
                  </label>

                  <select
                    name="orgId"
                    required
                    defaultValue=""
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="" disabled>
                      Select organization
                    </option>

                    {organizations
                      .filter(
                        (org) => org.active
                      )
                      .map((org) => (
                        <option
                          key={org.id}
                          value={org.id}
                        >
                          {org.name} —{" "}
                          {org.crmType}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Full name
                  </label>

                  <input
                    name="name"
                    required
                    placeholder="John Carter"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email
                  </label>

                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="john@company.com"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Phone
                  </label>

                  <input
                    name="phone"
                    placeholder="+1 555 123 4567"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Temporary password
                  </label>

                  <input
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    placeholder="Minimum 8 characters"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    CRM Role
                  </label>

                  <select
                    name="role"
                    required
                    defaultValue="owner"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    {ROLES.map(
                      (role) => (
                        <option
                          key={role.value}
                          value={
                            role.value
                          }
                        >
                          {role.label}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Subscription Plan
                  </label>

                  <select
                    name="plan"
                    required
                    defaultValue="starter"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    {PLANS.map(
                      (plan) => (
                        <option
                          key={plan.value}
                          value={
                            plan.value
                          }
                        >
                          {plan.label} — $
                          {plan.amount}
                          /month
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <p className="text-sm font-medium text-blue-900">
                  Subscription assignment
                </p>

                <p className="mt-1 text-xs leading-5 text-blue-700">
                  The selected plan is assigned
                  to the organization. This does
                  not charge PayPal; it updates the
                  CRM subscription record.
                </p>
              </div>

              <div className="flex justify-end gap-3 border-t pt-5">
                <button
                  type="button"
                  onClick={() =>
                    setOpen(false)
                  }
                  disabled={loading}
                  className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Creating..."
                    : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}