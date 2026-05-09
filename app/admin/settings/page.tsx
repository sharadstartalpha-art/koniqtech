"use client";

import {
  useEffect,
  useState,
  ReactNode,
} from "react";

import axios from "axios";

import {
  Save,
  Shield,
  CreditCard,
  Globe,
  Mail,
  Lock,
  Database,
  CheckCircle2,
  LucideIcon,
} from "lucide-react";

/* =========================
   TYPES
========================= */

type Settings = {
  platformName: string;
  supportEmail: string;

  allowRegistration: boolean;
  emailNotifications: boolean;
  maintenanceMode: boolean;
  autoBilling: boolean;
  smtpEnabled: boolean;
  paypalEnabled: boolean;
};

export default function AdminSettingsPage() {
  const [loading, setLoading] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  const [settings, setSettings] =
    useState<Settings>({
      platformName:
        "KoniqTech",

      supportEmail:
        "support@koniqtech.com",

      allowRegistration: true,

      emailNotifications: true,

      maintenanceMode: false,

      autoBilling: true,

      smtpEnabled: true,

      paypalEnabled: true,
    });

  /* =========================
     LOAD
  ========================= */

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res =
        await axios.get(
          "/api/admin/settings"
        );

      if (res.data) {
        setSettings(
          res.data
        );
      }

    } catch (err) {
      console.error(
        "Settings load failed",
        err
      );
    }
  };

  /* =========================
     UPDATE
  ========================= */

  const update = <
    K extends keyof Settings
  >(
    field: K,
    value: Settings[K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* =========================
     SAVE
  ========================= */

  const save = async () => {
    try {
      setLoading(true);

      setSaved(false);

      await axios.post(
        "/api/admin/settings",
        settings
      );

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 3000);

    } catch (err) {
      console.error(
        "Save failed",
        err
      );

      alert(
        "Failed to save settings"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">

      {/* HERO */}

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-black via-gray-900 to-black p-8 text-white">

        <div className="absolute top-0 right-0 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

          <div>

            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2 rounded-full text-sm mb-5">

              <Shield size={16} />

              Platform Configuration

            </div>

            <h1 className="text-4xl font-bold">
              Admin Settings
            </h1>

            <p className="text-gray-300 mt-4 max-w-2xl leading-7">
              Configure platform settings,
              billing, security, email
              delivery, and global SaaS
              behavior from one place.
            </p>

          </div>

          <button
            onClick={save}
            disabled={loading}
            className="bg-white text-black px-5 py-3 rounded-2xl font-medium hover:bg-gray-100 transition flex items-center gap-2 w-fit"
          >

            <Save size={18} />

            {loading
              ? "Saving..."
              : "Save Settings"}

          </button>

        </div>

      </div>

      {/* SUCCESS */}

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-2xl flex items-center gap-3">

          <CheckCircle2 size={20} />

          Settings updated successfully

        </div>
      )}

      {/* GRID */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* GENERAL */}

        <SectionCard
          title="General"
          description="Platform branding and core settings"
          icon={Globe}
        >

          <Input
            label="Platform Name"
            value={
              settings.platformName
            }
            onChange={(v: string) =>
              update(
                "platformName",
                v
              )
            }
          />

          <Input
            label="Support Email"
            value={
              settings.supportEmail
            }
            onChange={(v: string) =>
              update(
                "supportEmail",
                v
              )
            }
          />

          <Toggle
            label="Allow User Registration"
            checked={
              settings.allowRegistration
            }
            onChange={(
              v: boolean
            ) =>
              update(
                "allowRegistration",
                v
              )
            }
          />

          <Toggle
            label="Maintenance Mode"
            checked={
              settings.maintenanceMode
            }
            onChange={(
              v: boolean
            ) =>
              update(
                "maintenanceMode",
                v
              )
            }
          />

        </SectionCard>

        {/* EMAIL */}

        <SectionCard
          title="Email Settings"
          description="Manage email notifications and SMTP"
          icon={Mail}
        >

          <Toggle
            label="Enable SMTP"
            checked={
              settings.smtpEnabled
            }
            onChange={(
              v: boolean
            ) =>
              update(
                "smtpEnabled",
                v
              )
            }
          />

          <Toggle
            label="Email Notifications"
            checked={
              settings.emailNotifications
            }
            onChange={(
              v: boolean
            ) =>
              update(
                "emailNotifications",
                v
              )
            }
          />

        </SectionCard>

        {/* BILLING */}

        <SectionCard
          title="Billing & Payments"
          description="Manage subscriptions and payments"
          icon={CreditCard}
        >

          <Toggle
            label="Enable PayPal Billing"
            checked={
              settings.paypalEnabled
            }
            onChange={(
              v: boolean
            ) =>
              update(
                "paypalEnabled",
                v
              )
            }
          />

          <Toggle
            label="Automatic Billing"
            checked={
              settings.autoBilling
            }
            onChange={(
              v: boolean
            ) =>
              update(
                "autoBilling",
                v
              )
            }
          />

          <div className="grid grid-cols-2 gap-4">

            <MiniCard
              title="Monthly Revenue"
              value="$4,280"
            />

            <MiniCard
              title="Active Plans"
              value="4"
            />

          </div>

        </SectionCard>

        {/* SECURITY */}

        <SectionCard
          title="Security"
          description="Authentication and protection"
          icon={Lock}
        >

          <div className="space-y-4">

            <SecurityItem
              title="2FA Authentication"
              description="Extra admin protection enabled"
              status="Enabled"
            />

            <SecurityItem
              title="Encrypted Database"
              description="Sensitive data secured"
              status="Secure"
            />

            <SecurityItem
              title="API Protection"
              description="Rate limiting active"
              status="Active"
            />

          </div>

        </SectionCard>

      </div>

      {/* DATABASE */}

      <div className="bg-white border border-gray-100 rounded-3xl p-7 shadow-sm">

        <div className="flex items-center gap-4 mb-7">

          <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">

            <Database size={24} />

          </div>

          <div>

            <h2 className="text-2xl font-bold text-gray-900">
              Database & Backups
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Platform storage and backup management
            </p>

          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <MiniCard
            title="Database Status"
            value="Healthy"
          />

          <MiniCard
            title="Last Backup"
            value="2 hours ago"
          />

          <MiniCard
            title="Storage Used"
            value="1.4 GB"
          />

        </div>

      </div>

    </div>
  );
}

/* =========================
   SECTION
========================= */

function SectionCard({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-7 shadow-sm">

      <div className="flex items-start gap-4 mb-7">

        <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">

          <Icon size={24} />

        </div>

        <div>

          <h2 className="text-2xl font-bold text-gray-900">
            {title}
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            {description}
          </p>

        </div>

      </div>

      <div className="space-y-5">
        {children}
      </div>

    </div>
  );
}

/* =========================
   INPUT
========================= */

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
}) {
  return (
    <div>

      <label className="block text-sm font-medium text-gray-700 mb-2">

        {label}

      </label>

      <input
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
      />

    </div>
  );
}

/* =========================
   TOGGLE
========================= */

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (
    value: boolean
  ) => void;
}) {
  return (
    <div className="flex items-center justify-between border border-gray-100 rounded-2xl p-4">

      <span className="text-sm font-medium text-gray-700">
        {label}
      </span>

      <button
        onClick={() =>
          onChange(!checked)
        }
        className={`w-14 h-8 rounded-full transition relative ${
          checked
            ? "bg-orange-500"
            : "bg-gray-300"
        }`}
      >

        <div
          className={`absolute top-1 w-6 h-6 bg-white rounded-full transition ${
            checked
              ? "translate-x-7"
              : "translate-x-1"
          }`}
        />

      </button>

    </div>
  );
}

/* =========================
   MINI CARD
========================= */

function MiniCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="border border-gray-100 rounded-2xl p-5">

      <p className="text-sm text-gray-500 mb-2">
        {title}
      </p>

      <h3 className="text-2xl font-bold text-gray-900">
        {value}
      </h3>

    </div>
  );
}

/* =========================
   SECURITY ITEM
========================= */

function SecurityItem({
  title,
  description,
  status,
}: {
  title: string;
  description: string;
  status: string;
}) {
  return (
    <div className="border border-gray-100 rounded-2xl p-5 flex items-start justify-between gap-4">

      <div>

        <h3 className="font-semibold text-gray-900">
          {title}
        </h3>

        <p className="text-sm text-gray-500 mt-2 leading-6">
          {description}
        </p>

      </div>

      <div className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">

        {status}

      </div>

    </div>
  );
}