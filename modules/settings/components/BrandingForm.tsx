
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface BrandingFormProps {
  canEdit: boolean;
  initialTenantName: string;
  initialLogoUrl: string | null;
  initialPrimaryColor: string;
}

export default function BrandingForm({
  canEdit,
  initialTenantName,
  initialLogoUrl,
  initialPrimaryColor,
}: BrandingFormProps) {
  const router = useRouter();

  const [logo, setLogo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [tenantName, setTenantName] =
    useState(initialTenantName);

  const [primaryColor, setPrimaryColor] =
    useState(initialPrimaryColor);

  const [loading, setLoading] = useState(false);

  // Sync saved branding after server refresh
  useEffect(() => {
    setTenantName(initialTenantName);
  }, [initialTenantName]);

  useEffect(() => {
    setPrimaryColor(initialPrimaryColor);
  }, [initialPrimaryColor]);

  // Generate preview for newly selected logo
  useEffect(() => {
    if (!logo) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(logo);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [logo]);

  const displayedLogo = previewUrl || initialLogoUrl;

  async function saveBranding() {
    if (!canEdit) {
      alert("You do not have permission to edit branding.");
      return;
    }

    if (!tenantName.trim()) {
      alert("Company display name is required.");
      return;
    }

    if (
      !logo &&
      tenantName.trim() === initialTenantName &&
      primaryColor === initialPrimaryColor
    ) {
      alert("No branding changes to save.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      if (logo) {
        formData.append("logo", logo);
      }

      formData.append("tenantName", tenantName.trim());
      formData.append("primaryColor", primaryColor);

      const res = await fetch("/api/settings/branding", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.error || "Failed to save branding.");
        return;
      }

      setLogo(null);

      alert("Company branding updated successfully.");

      router.refresh();
    } catch (error) {
      console.error("Branding save error:", error);

      alert("Something went wrong while saving branding.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">

      <div>
        <h1 className="text-4xl font-bold">
          Company Branding
        </h1>

        <p className="mt-2 text-slate-500">
          Customize your company's visual identity.
        </p>
      </div>

      <div className="space-y-8 rounded-3xl border bg-white p-8">

        {/* COMPANY LOGO */}

        <div>
          <label className="mb-3 block text-sm font-medium text-slate-600">
            Company Logo
          </label>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

            {displayedLogo ? (
              <div className="flex h-32 w-48 items-center justify-center overflow-hidden rounded-xl border bg-slate-50 p-3">
                <img
                  src={displayedLogo}
                  alt="Company logo"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ) : (
              <div className="flex h-32 w-48 items-center justify-center rounded-xl border-2 border-dashed bg-slate-50 text-sm text-slate-400">
                No logo uploaded
              </div>
            )}

            <div className="space-y-3">

              <input
                id="company-logo"
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                disabled={!canEdit || loading}
                onChange={(e) => {
                  setLogo(e.target.files?.[0] ?? null);
                }}
                className="hidden"
              />

              {canEdit && (
                <label
                  htmlFor="company-logo"
                  className="inline-flex cursor-pointer items-center rounded-xl border px-5 py-3 font-medium hover:bg-slate-50"
                >
                  {displayedLogo ? "Change Logo" : "Upload Logo"}
                </label>
              )}

              {logo && (
                <p className="text-sm text-green-600">
                  Selected: {logo.name}
                </p>
              )}

              <p className="text-xs text-slate-400">
                PNG, JPG, SVG or WebP. Maximum 5 MB.
              </p>

            </div>
          </div>
        </div>

        {/* COMPANY DISPLAY NAME */}

        <div>
          <label className="mb-2 block text-sm text-slate-500">
            Company Display Name
          </label>

          <input
            type="text"
            value={tenantName}
            onChange={(e) => setTenantName(e.target.value)}
            disabled={!canEdit || loading}
            placeholder="Enter company display name"
            className="w-full rounded-xl border p-4 outline-none focus:border-orange-500 disabled:cursor-not-allowed disabled:bg-slate-100"
          />
        </div>

        {/* PRIMARY BRAND COLOR */}

        <div>
          <label className="mb-3 block text-sm text-slate-500">
            Primary Brand Color
          </label>

          <div className="flex items-center gap-4">

            <input
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              disabled={!canEdit || loading}
              className="h-14 w-20 cursor-pointer rounded-lg disabled:cursor-not-allowed"
            />

            <span className="font-medium text-slate-600">
              {primaryColor}
            </span>

          </div>
        </div>

        {/* SAVE */}

        {canEdit && (
          <button
            type="button"
            onClick={saveBranding}
            disabled={loading}
            className="rounded-xl bg-orange-600 px-6 py-3 font-medium text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Branding"}
          </button>
        )}

        {!canEdit && (
          <p className="text-sm text-slate-500">
            You have view-only access to branding settings.
          </p>
        )}

      </div>
    </div>
  );
}
