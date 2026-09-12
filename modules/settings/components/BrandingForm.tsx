"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BrandingForm({
  canEdit,
}: {
  canEdit: boolean;
}) {
  const router = useRouter();

  const [logo, setLogo] = useState<File | null>(null);
  const [tenantName, setTenantName] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#f97316");
  const [loading, setLoading] = useState(false);

  async function saveBranding() {
    if (!canEdit) {
      alert("You do not have permission to edit branding.");
      return;
    }

    if (!logo && !tenantName.trim()) {
      alert(
        "Please enter a company display name or upload a logo."
      );
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      if (logo) {
        formData.append("logo", logo);
      }

      formData.append(
        "tenantName",
        tenantName.trim()
      );

      formData.append(
        "primaryColor",
        primaryColor
      );

      const res = await fetch(
        "/api/settings/branding",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(
          data?.error ||
            "Failed to save branding."
        );
        return;
      }

      alert("Branding saved successfully.");

      router.refresh();

    } catch (error) {
      console.error(
        "Branding save error:",
        error
      );

      alert(
        "Something went wrong while saving branding."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      <div>
        <h1 className="text-4xl font-bold">
          Company Branding
        </h1>

        <p className="text-slate-500 mt-2">
          Customize your company's visual identity.
        </p>
      </div>

      <div
        className="
          bg-white
          border
          rounded-3xl
          p-8
          space-y-8
        "
      >

        {/* Logo */}

        <div>
          <label className="block text-sm text-slate-500 mb-2">
            Company Logo
          </label>

          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
            disabled={!canEdit || loading}
            onChange={(e) =>
              setLogo(
                e.target.files?.[0] ?? null
              )
            }
            className="
              w-full
              rounded-xl
              border
              p-3
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          />

          <p className="text-xs text-slate-400 mt-2">
            PNG, JPG, SVG or WebP recommended.
          </p>
        </div>

        {/* Display Name */}

        <div>
          <label className="block text-sm text-slate-500 mb-2">
            Company Display Name
          </label>

          <input
            value={tenantName}
            onChange={(e) =>
              setTenantName(
                e.target.value
              )
            }
            disabled={!canEdit || loading}
            placeholder="KoniqTech CRM"
            className="
              w-full
              rounded-xl
              border
              p-4
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          />
        </div>

        {/* Primary Color */}

        <div>
          <label className="block text-sm text-slate-500 mb-2">
            Primary Brand Color
          </label>

          <div className="flex items-center gap-4">

            <input
              type="color"
              value={primaryColor}
              onChange={(e) =>
                setPrimaryColor(
                  e.target.value
                )
              }
              disabled={!canEdit || loading}
              className="
                h-14
                w-20
                rounded-lg
                cursor-pointer
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            />

            <span className="text-slate-500">
              {primaryColor}
            </span>

          </div>
        </div>

        {/* Save */}

        <button
          type="button"
          onClick={saveBranding}
          disabled={!canEdit || loading}
          className="
            px-6
            py-3
            rounded-xl
            bg-orange-600
            text-white
            hover:bg-orange-700
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          {loading
            ? "Saving..."
            : "Save Branding"}
        </button>

        {!canEdit && (
          <p className="text-sm text-slate-500">
            You have view-only access to branding settings.
          </p>
        )}

      </div>

    </div>
  );
}