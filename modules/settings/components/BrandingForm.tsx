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
    <div className="max-w-3xl space-y-6">

      <h1 className="text-3xl font-bold">
        Company Branding
      </h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e)=>setLogo(e.target.files?.[0] ?? null)}
      />

      <input
        value={tenantName}
        onChange={(e)=>setTenantName(e.target.value)}
        placeholder="Company Display Name"
      />

      <input
        type="color"
        value={primaryColor}
        onChange={(e)=>setPrimaryColor(e.target.value)}
      />

      <button
        onClick={saveBranding}
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Branding"}
      </button>

    </div>
  );
}