"use client"

import Link from "next/link"

import {
  FormEvent,
  useMemo,
  useState,
  useTransition
} from "react"

import { useRouter } from "next/navigation"

import {
  AlertCircle,
  CheckCircle2,
  FileDown,
  Loader2,
  Pencil,
  PlusCircle,
  Save,
  Send,
  ShieldCheck,
  Trash2,
  UserCheck
} from "lucide-react"

import type {
  RoleActionState
} from "../actions"

/* =========================================================
   TYPES
========================================================= */

export type RoleFormValues = {
  id: string
  name: string
  description: string | null

  canCreate: boolean
  canEdit: boolean
  canDelete: boolean
  canApprove: boolean
  canAssign: boolean
  canExport: boolean
}

type RoleFormProps = {
  mode: "create" | "edit"

  role?: RoleFormValues

  action: (
    formData: FormData
  ) => Promise<RoleActionState>
}

type PermissionKey =
  | "canCreate"
  | "canEdit"
  | "canDelete"
  | "canApprove"
  | "canAssign"
  | "canExport"

type PermissionState = Record<
  PermissionKey,
  boolean
>

type PresetName =
  | "readOnly"
  | "standard"
  | "manager"
  | "fullControl"

/* =========================================================
   CONSTANTS
========================================================= */

const INITIAL_STATE: RoleActionState = {
  success: false,
  message: ""
}

const DEFAULT_PERMISSIONS: PermissionState = {
  canCreate: false,
  canEdit: false,
  canDelete: false,
  canApprove: false,
  canAssign: false,
  canExport: false
}

const PERMISSION_PRESETS: Record<
  PresetName,
  PermissionState
> = {
  readOnly: {
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canApprove: false,
    canAssign: false,
    canExport: false
  },

  standard: {
    canCreate: true,
    canEdit: true,
    canDelete: false,
    canApprove: false,
    canAssign: false,
    canExport: true
  },

  manager: {
    canCreate: true,
    canEdit: true,
    canDelete: false,
    canApprove: true,
    canAssign: true,
    canExport: true
  },

  fullControl: {
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canApprove: true,
    canAssign: true,
    canExport: true
  }
}

/* =========================================================
   PERMISSION CONFIG
========================================================= */

const PERMISSION_OPTIONS: {
  key: PermissionKey
  title: string
  description: string
  category: "core" | "workflow"
  icon: React.ReactNode
  variant: "blue" | "green" | "orange" | "red"
}[] = [
  {
    key: "canCreate",
    title: "Create",
    description:
      "Allow staff with this role to create new operational records.",
    category: "core",
    icon: <PlusCircle className="h-5 w-5" />,
    variant: "green"
  },
  {
    key: "canEdit",
    title: "Edit",
    description:
      "Allow staff to modify existing records available to their role.",
    category: "core",
    icon: <Pencil className="h-5 w-5" />,
    variant: "blue"
  },
  {
    key: "canDelete",
    title: "Delete",
    description:
      "Allow permanent deletion where the target module supports deletion.",
    category: "core",
    icon: <Trash2 className="h-5 w-5" />,
    variant: "red"
  },
  {
    key: "canApprove",
    title: "Approve",
    description:
      "Allow approval or rejection of records requiring management review.",
    category: "workflow",
    icon: <UserCheck className="h-5 w-5" />,
    variant: "orange"
  },
  {
    key: "canAssign",
    title: "Assign",
    description:
      "Allow work, leads, tasks, and other supported records to be assigned.",
    category: "workflow",
    icon: <Send className="h-5 w-5" />,
    variant: "blue"
  },
  {
    key: "canExport",
    title: "Export",
    description:
      "Allow exporting supported internal operational data and reports.",
    category: "workflow",
    icon: <FileDown className="h-5 w-5" />,
    variant: "green"
  }
]

/* =========================================================
   COMPONENT
========================================================= */

export default function RoleForm({
  mode,
  role,
  action
}: RoleFormProps) {
  const router = useRouter()

  const [
    isPending,
    startTransition
  ] = useTransition()

  const [
    state,
    setState
  ] = useState<RoleActionState>(
    INITIAL_STATE
  )

  const [
    permissions,
    setPermissions
  ] = useState<PermissionState>({
    canCreate:
      role?.canCreate ?? false,

    canEdit:
      role?.canEdit ?? false,

    canDelete:
      role?.canDelete ?? false,

    canApprove:
      role?.canApprove ?? false,

    canAssign:
      role?.canAssign ?? false,

    canExport:
      role?.canExport ?? false
  })

  /* =======================================================
     DERIVED VALUES
  ======================================================= */

  const enabledPermissionCount =
    useMemo(
      () =>
        Object.values(
          permissions
        ).filter(Boolean).length,
      [permissions]
    )

  const accessLevel =
    useMemo(() => {
      if (
        enabledPermissionCount === 6
      ) {
        return {
          label: "Full Control",
          className:
            "bg-red-50 text-red-700 border-red-200"
        }
      }

      if (
        enabledPermissionCount >= 4
      ) {
        return {
          label: "Advanced",
          className:
            "bg-orange-50 text-orange-700 border-orange-200"
        }
      }

      if (
        enabledPermissionCount >= 1
      ) {
        return {
          label: "Standard",
          className:
            "bg-blue-50 text-blue-700 border-blue-200"
        }
      }

      return {
        label: "Read Only",
        className:
          "bg-green-50 text-green-700 border-green-200"
      }
    }, [enabledPermissionCount])

  const corePermissions =
    PERMISSION_OPTIONS.filter(
      (permission) =>
        permission.category === "core"
    )

  const workflowPermissions =
    PERMISSION_OPTIONS.filter(
      (permission) =>
        permission.category ===
        "workflow"
    )

  /* =======================================================
     PERMISSION HANDLERS
  ======================================================= */

  function togglePermission(
    key: PermissionKey
  ) {
    setPermissions((current) => ({
      ...current,
      [key]: !current[key]
    }))
  }

  function applyPreset(
    preset: PresetName
  ) {
    setPermissions({
      ...PERMISSION_PRESETS[preset]
    })
  }

  /* =======================================================
     SUBMIT
  ======================================================= */

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    const formData =
      new FormData(
        event.currentTarget
      )

    /*
     * Permission values are controlled by React state.
     * Set explicit values so the server action receives
     * predictable true/false strings.
     */

    Object.entries(
      permissions
    ).forEach(([key, value]) => {
      formData.set(
        key,
        value ? "true" : "false"
      )
    })

    setState(INITIAL_STATE)

    startTransition(async () => {
      try {
        const result =
          await action(formData)

        setState(result)

        if (result.success) {
          const targetId =
            result.roleId ??
            role?.id

          if (targetId) {
            router.push(
              `/admin/roles/${targetId}`
            )
          } else {
            router.push(
              "/admin/roles"
            )
          }

          router.refresh()
        }
      } catch (error) {
        console.error(
          "ROLE_FORM_SUBMIT_ERROR:",
          error
        )

        setState({
          success: false,
          message:
            "Something went wrong while saving the employee role.",
          errors: {
            general:
              "The request could not be completed."
          }
        })
      }
    })
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-xl border border-slate-200 bg-white"
    >
      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="border-b border-slate-200 px-6 py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="font-semibold text-slate-950">
              Role Configuration
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Configure the internal role identity and
              operational permissions.
            </p>
          </div>

          <span
            className={`inline-flex w-fit items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold ${accessLevel.className}`}
          >
            <ShieldCheck className="h-4 w-4" />

            {accessLevel.label}
          </span>
        </div>
      </div>

      {/* ===================================================
          BODY
      =================================================== */}

      <div className="space-y-8 p-6">
        {/* MESSAGE */}

        {state.message && (
          <div
            className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${
              state.success
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {state.success ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            )}

            <span>
              {state.message}
            </span>
          </div>
        )}

        {/* =================================================
            BASIC INFORMATION
        ================================================= */}

        <section className="space-y-5">
          <SectionHeading
            title="Basic Information"
            description="Define the internal staff role and its purpose."
          />

          <div>
            <label
              htmlFor="role-name"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Role Name

              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <input
              id="role-name"
              name="name"
              type="text"
              required
              maxLength={100}
              defaultValue={
                role?.name ?? ""
              }
              placeholder="e.g. Sales Manager"
              className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
                state.errors?.name
                  ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              }`}
            />

            <FieldError
              message={
                state.errors?.name
              }
            />
          </div>

          <div>
            <label
              htmlFor="role-description"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Description
            </label>

            <textarea
              id="role-description"
              name="description"
              rows={4}
              maxLength={1000}
              defaultValue={
                role?.description ?? ""
              }
              placeholder="Describe the responsibilities and intended use of this role..."
              className={`w-full resize-none rounded-lg border bg-white px-3 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
                state.errors
                  ?.description
                  ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              }`}
            />

            <FieldError
              message={
                state.errors
                  ?.description
              }
            />
          </div>
        </section>

        {/* =================================================
            PERMISSION PRESETS
        ================================================= */}

        <section className="space-y-5 border-t border-slate-200 pt-7">
          <SectionHeading
            title="Permission Presets"
            description="Start with a common permission level, then customize individual permissions below."
          />

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <PresetButton
              title="Read Only"
              description="No action permissions"
              variant="green"
              onClick={() =>
                applyPreset("readOnly")
              }
            />

            <PresetButton
              title="Standard"
              description="Create, edit and export"
              variant="blue"
              onClick={() =>
                applyPreset("standard")
              }
            />

            <PresetButton
              title="Manager"
              description="Workflow management access"
              variant="orange"
              onClick={() =>
                applyPreset("manager")
              }
            />

            <PresetButton
              title="Full Control"
              description="All permissions enabled"
              variant="red"
              onClick={() =>
                applyPreset(
                  "fullControl"
                )
              }
            />
          </div>
        </section>

        {/* =================================================
            CORE PERMISSIONS
        ================================================= */}

        <section className="space-y-5 border-t border-slate-200 pt-7">
          <SectionHeading
            title="Core Permissions"
            description="Control basic record creation, modification and deletion capabilities."
          />

          <div className="grid gap-4 lg:grid-cols-3">
            {corePermissions.map(
              (permission) => (
                <PermissionCard
                  key={permission.key}
                  permission={permission}
                  enabled={
                    permissions[
                      permission.key
                    ]
                  }
                  onToggle={() =>
                    togglePermission(
                      permission.key
                    )
                  }
                />
              )
            )}
          </div>
        </section>

        {/* =================================================
            WORKFLOW PERMISSIONS
        ================================================= */}

        <section className="space-y-5 border-t border-slate-200 pt-7">
          <SectionHeading
            title="Workflow Permissions"
            description="Control approval, assignment and data export capabilities."
          />

          <div className="grid gap-4 lg:grid-cols-3">
            {workflowPermissions.map(
              (permission) => (
                <PermissionCard
                  key={permission.key}
                  permission={permission}
                  enabled={
                    permissions[
                      permission.key
                    ]
                  }
                  onToggle={() =>
                    togglePermission(
                      permission.key
                    )
                  }
                />
              )
            )}
          </div>
        </section>

        {/* =================================================
            PERMISSION SUMMARY
        ================================================= */}

        <section className="border-t border-slate-200 pt-7">
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-semibold text-blue-950">
                    Permission Summary
                  </p>

                  <p className="mt-1 text-sm text-blue-700">
                    {enabledPermissionCount} of 6
                    operational permissions are currently
                    enabled.
                  </p>
                </div>
              </div>

              <span
                className={`inline-flex w-fit rounded-full border px-3 py-1.5 text-xs font-semibold ${accessLevel.className}`}
              >
                {accessLevel.label}
              </span>
            </div>
          </div>
        </section>

        {/* GENERAL ERROR */}

        <FieldError
          message={
            state.errors?.general
          }
        />

        <FieldError
          message={
            state.errors?.permissions
          }
        />
      </div>

      {/* ===================================================
          FOOTER
      =================================================== */}

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50/60 px-6 py-4 sm:flex-row sm:justify-end">
        <Link
          href={
            mode === "edit" &&
            role?.id
              ? `/admin/roles/${role.id}`
              : "/admin/roles"
          }
          className="inline-flex h-10 items-center justify-center rounded-lg bg-orange-500 px-5 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />

              {mode === "create"
                ? "Creating..."
                : "Saving..."}
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />

              {mode === "create"
                ? "Create Role"
                : "Save Changes"}
            </>
          )}
        </button>
      </div>
    </form>
  )
}

/* =========================================================
   SECTION HEADING
========================================================= */

function SectionHeading({
  title,
  description
}: {
  title: string
  description: string
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-950">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  )
}

/* =========================================================
   PRESET BUTTON
========================================================= */

function PresetButton({
  title,
  description,
  variant,
  onClick
}: {
  title: string
  description: string
  variant:
    | "blue"
    | "green"
    | "orange"
    | "red"
  onClick: () => void
}) {
  const styles = {
    blue:
      "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100",

    green:
      "border-green-200 bg-green-50 text-green-700 hover:bg-green-100",

    orange:
      "border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100",

    red:
      "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border p-4 text-left transition ${styles[variant]}`}
    >
      <p className="text-sm font-semibold">
        {title}
      </p>

      <p className="mt-1 text-xs opacity-80">
        {description}
      </p>
    </button>
  )
}

/* =========================================================
   PERMISSION CARD
========================================================= */

function PermissionCard({
  permission,
  enabled,
  onToggle
}: {
  permission: {
    key: PermissionKey
    title: string
    description: string
    icon: React.ReactNode
    variant:
      | "blue"
      | "green"
      | "orange"
      | "red"
  }

  enabled: boolean

  onToggle: () => void
}) {
  const iconStyles = {
    blue:
      "bg-blue-50 text-blue-600",

    green:
      "bg-green-50 text-green-600",

    orange:
      "bg-orange-50 text-orange-600",

    red:
      "bg-red-50 text-red-600"
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={enabled}
      className={`rounded-xl border p-4 text-left transition ${
        enabled
          ? "border-green-300 bg-green-50/40"
          : "border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/30"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconStyles[permission.variant]}`}
        >
          {permission.icon}
        </div>

        <div
          className={`relative h-6 w-11 shrink-0 rounded-full transition ${
            enabled
              ? "bg-green-600"
              : "bg-slate-300"
          }`}
        >
          <span
            className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
              enabled
                ? "left-6"
                : "left-1"
            }`}
          />
        </div>
      </div>

      <p className="mt-4 text-sm font-semibold text-slate-950">
        {permission.title}
      </p>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {permission.description}
      </p>

      <div className="mt-3">
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            enabled
              ? "bg-green-100 text-green-700"
              : "bg-red-50 text-red-600"
          }`}
        >
          {enabled
            ? "Enabled"
            : "Disabled"}
        </span>
      </div>
    </button>
  )
}

/* =========================================================
   FIELD ERROR
========================================================= */

function FieldError({
  message
}: {
  message?: string
}) {
  if (!message) {
    return null
  }

  return (
    <p className="mt-2 flex items-start gap-1.5 text-xs font-medium text-red-600">
      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />

      <span>{message}</span>
    </p>
  )
}