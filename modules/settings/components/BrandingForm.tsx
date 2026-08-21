"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BrandingForm() {
  const router = useRouter();

  const [logo, setLogo] = useState<File | null>(null);
  const [tenantName, setTenantName] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#f97316");
  const [loading, setLoading] = useState(false);

  async function saveBranding() {
    if (!logo) {
      alert("Please upload a company logo.");
      return;
    }

    setLoading(true);

    const formData = new FormData();

    formData.append("logo", logo);
    formData.append("tenantName", tenantName);
    formData.append("primaryColor", primaryColor);

    const res = await fetch("/api/settings/branding", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      router.push("/dashboard");
    }

    setLoading(false);
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
        accept="image/*"
        onChange={(e)=>
          setLogo(
            e.target.files?.[0] ?? null
          )
        }
        className="
        w-full
        rounded-xl
        border
        p-3
        "
      />

      <p className="text-xs text-slate-400 mt-2">
        PNG, JPG or SVG recommended.
      </p>

    </div>

    {/* Display Name */}

    <div>

      <label className="block text-sm text-slate-500 mb-2">
        Company Display Name
      </label>

      <input
        value={tenantName}
        onChange={(e)=>
          setTenantName(
            e.target.value
          )
        }
        placeholder="Koniqtech CRM"
        className="
        w-full
        rounded-xl
        border
        p-4
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
          onChange={(e)=>
            setPrimaryColor(
              e.target.value
            )
          }
          className="
          h-14
          w-20
          rounded-lg
          cursor-pointer
          "
        />

        <span className="text-slate-500">
          {primaryColor}
        </span>

      </div>

    </div>

    {/* Save */}

    <button
      onClick={saveBranding}
      disabled={loading}
      className="
      px-6
      py-3
      rounded-xl
      bg-orange-600
      text-white
      hover:bg-orange-700
      disabled:opacity-50
      "
    >

      {
        loading
          ? "Saving..."
          : "Save Branding"
      }

    </button>

  </div>

</div>

);
}