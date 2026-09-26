"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Building2,
  Check,
  ChevronDown,
  Edit3,
  Globe2,
  Loader2,
  MapPin,
  MoreHorizontal,
  Phone,
  Plus,
  RefreshCw,
  Star,
  Trash2,
  X,
} from "lucide-react";

type LocationStatus = "ACTIVE" | "INACTIVE";

type Location = {
  id: string;
  name: string;

  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;

  phone?: string | null;
  email?: string | null;
  timezone?: string | null;

  status: LocationStatus;
  isDefault: boolean;

  createdAt?: string;
  updatedAt?: string;
};

type LocationResponse = {
  locations: Location[];
  plan?: string | null;
  maxLocations?: number | null;
};

type FormState = {
  name: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
  timezone: string;
  status: LocationStatus;
  isDefault: boolean;
};

const EMPTY_FORM: FormState = {
  name: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "United States",
  phone: "",
  email: "",
  timezone: "America/New_York",
  status: "ACTIVE",
  isDefault: false,
};

const TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Phoenix",
  "America/Anchorage",
  "Pacific/Honolulu",
  "Europe/London",
  "Europe/Paris",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Australia/Sydney",
];

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

function formatAddress(location: Location): string {
  return [
    location.addressLine1,
    location.addressLine2,
    location.city,
    location.state,
    location.postalCode,
    location.country,
  ]
    .filter(Boolean)
    .join(", ");
}

function getPlanLabel(plan?: string | null): string {
  if (!plan) {
    return "Current Plan";
  }

  return plan.charAt(0).toUpperCase() + plan.slice(1).toLowerCase();
}

function getFallbackLimit(plan?: string | null): number | null {
  const normalized = plan?.toLowerCase();

  if (normalized === "enterprise") {
    return null;
  }

  return 1;
}

function isEnterprisePlan(plan?: string | null): boolean {
  return plan?.toLowerCase() === "enterprise";
}

function formatDate(date?: string): string {
  if (!date) {
    return "";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [plan, setPlan] = useState<string | null>(null);
  const [maxLocations, setMaxLocations] = useState<number | null>(1);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] =
    useState<Location | null>(null);

  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const [deleteLocation, setDeleteLocation] =
    useState<Location | null>(null);

  const [deleting, setDeleting] = useState(false);

  const resolvedMaxLocations = useMemo(() => {
    if (maxLocations === null) {
      return getFallbackLimit(plan);
    }

    if (typeof maxLocations === "number") {
      return maxLocations;
    }

    return getFallbackLimit(plan);
  }, [maxLocations, plan]);

  const locationLimitReached =
    resolvedMaxLocations !== null &&
    locations.length >= resolvedMaxLocations;

  const enterprise = isEnterprisePlan(plan);

  const fetchLocations = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const response = await fetch("/api/settings/locations", {
          method: "GET",
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            data?.error || "Unable to load locations."
          );
        }

        const payload = data as LocationResponse;

        setLocations(
          Array.isArray(payload.locations)
            ? payload.locations
            : []
        );

        setPlan(payload.plan ?? null);

        if (
          payload.maxLocations === null ||
          typeof payload.maxLocations === "number"
        ) {
          setMaxLocations(payload.maxLocations);
        } else {
          setMaxLocations(getFallbackLimit(payload.plan));
        }
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    void fetchLocations();
  }, [fetchLocations]);

  useEffect(() => {
    if (!success) {
      return;
    }

    const timer = window.setTimeout(() => {
      setSuccess("");
    }, 4000);

    return () => window.clearTimeout(timer);
  }, [success]);

  const openCreateModal = () => {
    if (locationLimitReached) {
      setError(
        enterprise
          ? "You have reached the location limit."
          : `Your ${getPlanLabel(
              plan
            )} plan includes 1 location. Upgrade to Enterprise to add additional locations.`
      );

      return;
    }

    setEditingLocation(null);

    setForm({
      ...EMPTY_FORM,
      isDefault: locations.length === 0,
    });

    setError("");
    setSuccess("");
    setMenuOpen(null);
    setModalOpen(true);
  };

  const openEditModal = (location: Location) => {
    setEditingLocation(location);

    setForm({
      name: location.name ?? "",
      addressLine1: location.addressLine1 ?? "",
      addressLine2: location.addressLine2 ?? "",
      city: location.city ?? "",
      state: location.state ?? "",
      postalCode: location.postalCode ?? "",
      country: location.country ?? "United States",
      phone: location.phone ?? "",
      email: location.email ?? "",
      timezone:
        location.timezone ?? "America/New_York",
      status: location.status ?? "ACTIVE",
      isDefault: location.isDefault,
    });

    setError("");
    setSuccess("");
    setMenuOpen(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) {
      return;
    }

    setModalOpen(false);
    setEditingLocation(null);
    setForm(EMPTY_FORM);
    setError("");
  };

  const updateField = <K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");

    const name = form.name.trim();
    const addressLine1 = form.addressLine1.trim();
    const addressLine2 = form.addressLine2.trim();
    const city = form.city.trim();
    const state = form.state.trim();
    const postalCode = form.postalCode.trim();
    const country = form.country.trim();
    const phone = form.phone.trim();
    const email = form.email.trim();
    const timezone = form.timezone.trim();

    if (!name) {
      setError("Location name is required.");
      return;
    }

    if (name.length > 100) {
      setError(
        "Location name must be 100 characters or less."
      );
      return;
    }

    if (!addressLine1) {
      setError("Address is required.");
      return;
    }

    if (!city) {
      setError("City is required.");
      return;
    }

    if (!state) {
      setError("State is required.");
      return;
    }

    if (!postalCode) {
      setError("ZIP / Postal code is required.");
      return;
    }

    if (!country) {
      setError("Country is required.");
      return;
    }

    if (email) {
      const emailValid =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!emailValid) {
        setError("Please enter a valid email address.");
        return;
      }
    }

    if (phone) {
      const phoneValid = /^[0-9+().\-\s]{7,25}$/.test(phone);

      if (!phoneValid) {
        setError("Please enter a valid phone number.");
        return;
      }
    }

    if (!timezone) {
      setError("Timezone is required.");
      return;
    }

    if (
      !editingLocation &&
      resolvedMaxLocations !== null &&
      locations.length >= resolvedMaxLocations
    ) {
      setError(
        `Your ${getPlanLabel(
          plan
        )} plan has reached its location limit.`
      );
      return;
    }

    setSaving(true);

    try {
      const method = editingLocation ? "PATCH" : "POST";

      const body = {
        ...(editingLocation
          ? { id: editingLocation.id }
          : {}),
        name,
        addressLine1,
        addressLine2: addressLine2 || null,
        city,
        state,
        postalCode,
        country,
        phone: phone || null,
        email: email || null,
        timezone,
        status: form.status,
        isDefault: form.isDefault,
      };

      const response = await fetch(
        "/api/settings/locations",
        {
          method,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to save the location."
        );
      }

      await fetchLocations(true);

      setModalOpen(false);
      setEditingLocation(null);
      setForm(EMPTY_FORM);

      setSuccess(
        editingLocation
          ? "Location updated successfully."
          : "Location created successfully."
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefault = async (
    location: Location
  ) => {
    if (location.isDefault) {
      setMenuOpen(null);
      return;
    }

    setError("");
    setSuccess("");
    setMenuOpen(null);

    try {
      const response = await fetch(
        "/api/settings/locations",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            id: location.id,
            isDefault: true,
          }),
        }
      );

      const data = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to change the default location."
        );
      }

      await fetchLocations(true);

      setSuccess(
        `${location.name} is now the default location.`
      );
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    if (!deleteLocation) {
      return;
    }

    setDeleting(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        "/api/settings/locations",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            id: deleteLocation.id,
          }),
        }
      );

      const data = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to delete the location."
        );
      }

      setDeleteLocation(null);

      await fetchLocations(true);

      setSuccess("Location deleted successfully.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-full bg-[#f8fafc] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
              <span>Settings</span>
              <span>/</span>
              <span className="text-slate-700">
                Locations
              </span>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              Locations
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your business locations and
              operating addresses.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void fetchLocations(true)}
              disabled={refreshing || loading}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  refreshing ? "animate-spin" : ""
                }`}
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={openCreateModal}
              disabled={locationLimitReached}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <Plus className="h-4 w-4" />
              Add Location
            </button>
          </div>
        </div>

        {/* Plan information */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50">
                <Building2 className="h-5 w-5 text-orange-500" />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Current Plan
                </p>

                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className="text-lg font-semibold text-slate-950">
                    {getPlanLabel(plan)}
                  </span>

                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                    {enterprise
                      ? "Multiple locations"
                      : "1 location"}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-left lg:text-right">
              <p className="text-sm text-slate-500">
                Locations
              </p>

              <p className="mt-1 text-lg font-semibold text-slate-950">
                {locations.length}
                <span className="ml-1 text-sm font-normal text-slate-400">
                  {resolvedMaxLocations === null
                    ? " / Unlimited"
                    : ` / ${resolvedMaxLocations}`}
                </span>
              </p>
            </div>
          </div>

          {!enterprise && locationLimitReached && (
            <div className="mt-4 flex items-start gap-3 rounded-lg border border-orange-200 bg-orange-50 p-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />

              <div className="text-sm text-orange-800">
                <p className="font-semibold">
                  Location limit reached
                </p>

                <p className="mt-0.5">
                  Your {getPlanLabel(plan)} plan includes
                  one location. Upgrade to Enterprise to
                  add additional locations.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Alerts */}
        {error && !modalOpen && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

            <div className="flex-1 text-sm text-red-800">
              {error}
            </div>

            <button
              type="button"
              onClick={() => setError("")}
              className="text-red-500 hover:text-red-700"
              aria-label="Dismiss error"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
            <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />

            <div className="flex-1 text-sm font-medium text-green-800">
              {success}
            </div>

            <button
              type="button"
              onClick={() => setSuccess("")}
              className="text-green-500 hover:text-green-700"
              aria-label="Dismiss success message"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex min-h-[360px] items-center justify-center rounded-xl border border-slate-200 bg-white">
            <div className="flex flex-col items-center gap-3 text-slate-500">
              <Loader2 className="h-7 w-7 animate-spin" />
              <p className="text-sm">
                Loading locations...
              </p>
            </div>
          </div>
        ) : locations.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-50">
              <MapPin className="h-7 w-7 text-orange-500" />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-slate-950">
              No locations yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Add your first business location to start
              managing jobs, customers, crews and
              operations for this location.
            </p>

            <button
              type="button"
              onClick={openCreateModal}
              className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              <Plus className="h-4 w-4" />
              Add Your First Location
            </button>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {locations.map((location) => (
              <div
                key={location.id}
                className="relative rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
              >
                {/* Card header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                      <Building2 className="h-5 w-5 text-slate-600" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="truncate text-base font-semibold text-slate-950">
                          {location.name}
                        </h2>

                        {location.isDefault && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-[11px] font-semibold text-orange-600">
                            <Star className="h-3 w-3 fill-current" />
                            Default
                          </span>
                        )}
                      </div>

                      <span
                        className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          location.status === "ACTIVE"
                            ? "bg-green-50 text-green-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {location.status}
                      </span>
                    </div>
                  </div>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setMenuOpen(
                          menuOpen === location.id
                            ? null
                            : location.id
                        )
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                      aria-label={`Actions for ${location.name}`}
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>

                    {menuOpen === location.id && (
                      <div className="absolute right-0 top-9 z-20 w-48 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                        <button
                          type="button"
                          onClick={() =>
                            openEditModal(location)
                          }
                          className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <Edit3 className="h-4 w-4" />
                          Edit Location
                        </button>

                        {!location.isDefault && (
                          <button
                            type="button"
                            onClick={() =>
                              void handleSetDefault(
                                location
                              )
                            }
                            className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
                          >
                            <Star className="h-4 w-4" />
                            Make Default
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setMenuOpen(null);
                            setDeleteLocation(
                              location
                            );
                          }}
                          className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete Location
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div className="mt-5 flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

                  <p className="text-sm leading-6 text-slate-600">
                    {formatAddress(location) ||
                      "No address provided"}
                  </p>
                </div>

                {/* Phone */}
                {location.phone && (
                  <div className="mt-3 flex items-center gap-3">
                    <Phone className="h-4 w-4 shrink-0 text-slate-400" />

                    <span className="text-sm text-slate-600">
                      {location.phone}
                    </span>
                  </div>
                )}

                {/* Email */}
                {location.email && (
                  <div className="mt-3 flex items-center gap-3">
                    <Globe2 className="h-4 w-4 shrink-0 text-slate-400" />

                    <span className="truncate text-sm text-slate-600">
                      {location.email}
                    </span>
                  </div>
                )}

                {/* Timezone */}
                {location.timezone && (
                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <p className="text-xs text-slate-400">
                      Timezone
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {location.timezone}
                    </p>
                  </div>
                )}

                {location.createdAt && (
                  <p className="mt-3 text-xs text-slate-400">
                    Added {formatDate(location.createdAt)}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Modal header */}
            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">
                  {editingLocation
                    ? "Edit Location"
                    : "Add Location"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {editingLocation
                    ? "Update the details for this business location."
                    : "Add a business location for your organization."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal body */}
            <div className="overflow-y-auto px-6 py-6">
              {error && (
                <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />

                  <p className="text-sm text-red-800">
                    {error}
                  </p>
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                {/* Location name */}
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Location Name
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) =>
                      updateField(
                        "name",
                        event.target.value
                      )
                    }
                    placeholder="e.g. Charlotte Office"
                    maxLength={100}
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Address
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    value={form.addressLine1}
                    onChange={(event) =>
                      updateField(
                        "addressLine1",
                        event.target.value
                      )
                    }
                    placeholder="Street address"
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Address Line 2
                  </label>

                  <input
                    type="text"
                    value={form.addressLine2}
                    onChange={(event) =>
                      updateField(
                        "addressLine2",
                        event.target.value
                      )
                    }
                    placeholder="Suite, unit, building, etc."
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    City
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    value={form.city}
                    onChange={(event) =>
                      updateField(
                        "city",
                        event.target.value
                      )
                    }
                    placeholder="Charlotte"
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                {/* State */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    State / Province
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    value={form.state}
                    onChange={(event) =>
                      updateField(
                        "state",
                        event.target.value
                      )
                    }
                    placeholder="North Carolina"
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                {/* Postal */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    ZIP / Postal Code
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    value={form.postalCode}
                    onChange={(event) =>
                      updateField(
                        "postalCode",
                        event.target.value
                      )
                    }
                    placeholder="28202"
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Country
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    value={form.country}
                    onChange={(event) =>
                      updateField(
                        "country",
                        event.target.value
                      )
                    }
                    placeholder="United States"
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Phone
                  </label>

                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(event) =>
                      updateField(
                        "phone",
                        event.target.value
                      )
                    }
                    placeholder="+1 (704) 555-0100"
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Location Email
                  </label>

                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      updateField(
                        "email",
                        event.target.value
                      )
                    }
                    placeholder="office@example.com"
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                {/* Timezone */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Timezone
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <div className="relative">
                    <select
                      value={form.timezone}
                      onChange={(event) =>
                        updateField(
                          "timezone",
                          event.target.value
                        )
                      }
                      className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-10 text-sm text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    >
                      {TIMEZONES.map((timezone) => (
                        <option
                          key={timezone}
                          value={timezone}
                        >
                          {timezone}
                        </option>
                      ))}
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-3 top-3 h-5 w-5 text-slate-400" />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Status
                  </label>

                  <div className="relative">
                    <select
                      value={form.status}
                      onChange={(event) =>
                        updateField(
                          "status",
                          event.target
                            .value as LocationStatus
                        )
                      }
                      className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-10 text-sm text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    >
                      <option value="ACTIVE">
                        Active
                      </option>

                      <option value="INACTIVE">
                        Inactive
                      </option>
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-3 top-3 h-5 w-5 text-slate-400" />
                  </div>
                </div>

                {/* Default */}
                <div className="sm:col-span-2">
                  <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-4 transition hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={form.isDefault}
                      onChange={(event) =>
                        updateField(
                          "isDefault",
                          event.target.checked
                        )
                      }
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                    />

                    <span>
                      <span className="block text-sm font-medium text-slate-800">
                        Set as default location
                      </span>

                      <span className="mt-0.5 block text-xs leading-5 text-slate-500">
                        The default location will be used
                        where a location is required but
                        has not been explicitly selected.
                      </span>
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="h-10 rounded-lg border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={saving}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {saving && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                {saving
                  ? "Saving..."
                  : editingLocation
                  ? "Save Changes"
                  : "Create Location"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteLocation && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-slate-950">
              Delete Location?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to delete{" "}
              <strong className="font-semibold text-slate-800">
                {deleteLocation.name}
              </strong>
              ? This action cannot be undone.
            </p>

            {deleteLocation.isDefault && (
              <div className="mt-4 rounded-lg border border-orange-200 bg-orange-50 p-3 text-sm text-orange-800">
                This is currently the default location.
                Your system may require another location
                to become the default before deletion.
              </div>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  setDeleteLocation(null)
                }
                disabled={deleting}
                className="h-10 rounded-lg border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={deleting}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {deleting && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                {deleting
                  ? "Deleting..."
                  : "Delete Location"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}