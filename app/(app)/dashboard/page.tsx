import prisma from "@/shared/lib/prisma"
import GettingStarted from "@/components/dashboard/GettingStarted"
import NextAction from "@/components/dashboard/NextAction"
import WelcomeModal from "@/components/dashboard/WelcomeModal"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

import {
  Users,
  Briefcase,
  UserPlus,
  ArrowRight,
} from "lucide-react"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  // ------------------------------------------------------------
  // AUTHENTICATION
  // ------------------------------------------------------------

  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  // ------------------------------------------------------------
  // LOAD CURRENT USER FROM DATABASE
  // IMPORTANT:
  // Use session.user.id, NOT email.
  // ------------------------------------------------------------

  const dbUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },

    include: {
      organization: true,

      organizationRole: {
        include: {
          permissions: true,
        },
      },
    },
  })

  if (!dbUser) {
    redirect("/login")
  }

  // ------------------------------------------------------------
  // ACCOUNT STATUS
  //
  // Inactive users must not be allowed to use the CRM.
  // This also protects against an already-existing session.
  // ------------------------------------------------------------

  if (dbUser.status !== "active") {
    redirect("/login?error=inactive")
  }

  // ------------------------------------------------------------
  // PLATFORM / INTERNAL USERS
  // ------------------------------------------------------------

  const platformRole = String(
    (session.user as any)?.role ?? ""
  )
    .trim()
    .toLowerCase()

  if (platformRole === "super_admin") {
    redirect("/admin/dashboard")
  }

  // ------------------------------------------------------------
  // CUSTOMER CRM USER
  //
  // Internal platform users should not use the customer dashboard.
  // Customer users must have an OrganizationRole.
  // ------------------------------------------------------------

  if (!dbUser.organizationRole) {
    redirect("/unauthorized")
  }

  // ------------------------------------------------------------
  // ORGANIZATION SAFETY
  // ------------------------------------------------------------

  if (!dbUser.orgId || !dbUser.organization) {
    redirect("/unauthorized")
  }

  // ------------------------------------------------------------
  // CUSTOMER ROLE
  // ------------------------------------------------------------

  const organizationRole =
    dbUser.organizationRole.name
      ?.trim()
      .toLowerCase()

  const isOwner =
    organizationRole === "owner"

  // ------------------------------------------------------------
  // DASHBOARD PERMISSION
  //
  // Owner always has dashboard access.
  //
  // Everyone else must have:
  // Dashboard -> View = true
  // ------------------------------------------------------------

  const dashboardPermission =
    dbUser.organizationRole.permissions.find(
      (permission) =>
        String(permission.module)
          .trim()
          .toLowerCase() === "dashboard"
    )

  const canViewDashboard =
    isOwner ||
    Boolean(dashboardPermission?.canView)

  if (!canViewDashboard) {
    redirect("/unauthorized")
  }

  // ------------------------------------------------------------
  // PERMISSION HELPER
  // Used for individual dashboard cards.
  // ------------------------------------------------------------

  const canViewModule = (
    moduleName: string
  ) => {
    if (isOwner) {
      return true
    }

    const permission =
      dbUser.organizationRole!.permissions.find(
        (item) =>
          String(item.module)
            .trim()
            .toLowerCase() ===
          moduleName.trim().toLowerCase()
      )

    return Boolean(permission?.canView)
  }

  // ------------------------------------------------------------
  // CRM DATA
  // ------------------------------------------------------------

  const [
    leads,
    customers,
    jobs,
    teamMembers,
    invoices,
    recentLeads,
    recentCustomers,
    recentJobs,
  ] = await Promise.all([
    prisma.lead.count({
      where: {
        orgId: dbUser.orgId,
      },
    }),

    prisma.customer.count({
      where: {
        orgId: dbUser.orgId,
      },
    }),

    prisma.job.count({
      where: {
        orgId: dbUser.orgId,
      },
    }),

    prisma.user.count({
      where: {
        orgId: dbUser.orgId,
      },
    }),

    prisma.invoice.count({
      where: {
        orgId: dbUser.orgId,
      },
    }),

    prisma.lead.findMany({
      where: {
        orgId: dbUser.orgId,
      },

      take: 3,

      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.customer.findMany({
      where: {
        orgId: dbUser.orgId,
      },

      take: 3,

      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.job.findMany({
      where: {
        orgId: dbUser.orgId,
      },

      take: 3,

      orderBy: {
        createdAt: "desc",
      },
    }),
  ])

   // ------------------------------------------------------------
  // SUBSCRIPTION / TRIAL
  // ------------------------------------------------------------

  const subscription = await prisma.subscription.findUnique({
    where: {
      orgId: dbUser.orgId,
    },
  });

  const isTrial = subscription?.status === "trial";

  const subscriptionEnds = isTrial
    ? subscription?.trialEnd ?? dbUser.organization.trialEndsAt
    : subscription?.renewAt ?? dbUser.organization.subscriptionEndsAt;

  const now = Date.now();

  const millisecondsLeft = subscriptionEnds
    ? new Date(subscriptionEnds).getTime() - now
    : null;

  const daysLeft =
    millisecondsLeft !== null
      ? Math.max(0, Math.ceil(millisecondsLeft / (1000 * 60 * 60 * 24)))
      : null;

  const expired =
    isTrial
      ? millisecondsLeft === null || millisecondsLeft <= 0
      : subscription?.status === "expired" ||
        (subscription?.status === "active" &&
          millisecondsLeft !== null &&
          millisecondsLeft <= 0);
  // ------------------------------------------------------------
  // ONBOARDING
  // ------------------------------------------------------------

  const onboarding = {
    company: Boolean(
      dbUser.organization.name
    ),

    organization:
      Boolean(
        dbUser.organization.timezone
      ) &&
      Boolean(
        dbUser.organization.currency
      ),

    branding: Boolean(
      dbUser.organization.logo
    ),

    team: teamMembers > 1,

    lead: leads > 0,

    customer: customers > 0,

    job: jobs > 0,

    invoice: invoices > 0,
  }

  // ------------------------------------------------------------
  // NEXT ACTION
  // ------------------------------------------------------------

  const nextAction =
    !onboarding.company
      ? {
          title: "Setup Company",

          description:
            "Add your business information so customers know who you are.",

          href: "/settings/company",
        }

      : !onboarding.organization
      ? {
          title:
            "Complete Organization Settings",

          description:
            "Configure your timezone, currency and business settings.",

          href: "/settings/organization",
        }

      : !onboarding.branding
      ? {
          title:
            "Upload Company Logo",

          description:
            "Your logo will appear on Quotes, Invoices and customer documents.",

          href: "/settings/branding",
        }

      : !onboarding.team
      ? {
          title: "Invite Your Team",

          description:
            "Invite employees so they can access your CRM.",

          href: "/settings/team",
        }

      : !onboarding.lead
      ? {
          title: "Create Your First Lead",

          description:
            "Leads are potential customers waiting to become clients.",

          href: "/leads",
        }

      : !onboarding.customer
      ? {
          title:
            "Create Your First Customer",

          description:
            "Convert a lead or create a customer manually.",

          href: "/customers",
        }

      : !onboarding.job
      ? {
          title:
            "Create Your First Job",

          description:
            "Jobs help you schedule and manage work for customers.",

          href: "/jobs",
        }

      : !onboarding.invoice
      ? {
          title:
            "Generate Your First Invoice",

          description:
            "Invoices help you bill customers and track payments.",

          href: "/invoices",
        }

      : null

  // ------------------------------------------------------------
  // ONBOARDING PROGRESS
  // ------------------------------------------------------------

  const completedSteps =
    Object.values(onboarding).filter(Boolean)
      .length

  const totalSteps =
    Object.keys(onboarding).length

  const progress =
    Math.round(
      (completedSteps / totalSteps) * 100
    )

  const companyCompleted =
    Boolean(
      dbUser.organization.name
    ) &&
    Boolean(
      dbUser.organization.email
    ) &&
    Boolean(
      dbUser.organization.phone
    )

  const organizationCompleted =
    Boolean(
      dbUser.organization.timezone
    ) &&
    Boolean(
      dbUser.organization.currency
    ) &&
    Boolean(
      dbUser.organization.language
    )

  const brandingCompleted =
    Boolean(
      dbUser.organization.logo
    )

  const teamCompleted =
    teamMembers > 1

  const onboardingSteps = [
    {
      title: "Company Information",

      completed:
        companyCompleted,

      href:
        "/settings/company",

      description:
        "Complete your business profile.",
    },

    {
      title:
        "Organization Settings",

      completed:
        organizationCompleted,

      href:
        "/settings/organization",

      description:
        "Configure your organization.",
    },

    {
      title:
        "Upload Company Logo",

      completed:
        brandingCompleted,

      href:
        "/settings/branding",

      description:
        "Your logo appears on invoices and quotes.",
    },

    {
      title: "Invite Team",

      completed:
        teamCompleted,

      href:
        "/settings/invitations",

      description:
        "Invite employees to collaborate.",
    },

    {
      title:
        "Create First Lead",

      completed:
        leads > 0,

      href:
        "/leads",

      description:
        "Start capturing new opportunities.",
    },

    {
      title:
        "Create First Customer",

      completed:
        customers > 0,

      href:
        "/customers",

      description:
        "Add your first customer.",
    },

    {
      title:
        "Create First Job",

      completed:
        jobs > 0,

      href:
        "/jobs",

      description:
        "Schedule your first job.",
    },

    {
      title:
        "Create First Invoice",

      completed:
        invoices > 0,

      href:
        "/invoices",

      description:
        "Send your first invoice.",
    },
  ]

  const nextStep =
    onboardingSteps.find(
      (step) => !step.completed
    ) ?? null

  // ------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------

  return (
    <div className="space-y-6">

      {!dbUser.welcomeSeen && (
        <WelcomeModal />
      )}

      {/* HEADER */}

      <div>
        <h1
          className="
            text-4xl
            font-semibold
            tracking-tight
          "
        >
          Dashboard
        </h1>

        <p
          className="
            text-sm
            text-slate-500
            mt-1
          "
        >
          Welcome back,{" "}
          {dbUser.name || "User"}
        </p>
      </div>

      {/* ONBOARDING */}

      {progress < 25 ? (
        <GettingStarted
          progress={progress}
          steps={onboardingSteps}
        />
      ) : progress < 100 &&
        nextAction ? (
        <NextAction
          title={nextAction.title}
          description={
            nextAction.description
          }
          href={nextAction.href}
          progress={progress}
        />
      ) : null}

      {/* KPI CARDS */}

      <div
        className="
          grid
          md:grid-cols-3
          gap-4
        "
      >

        {canViewModule("Leads") && (
          <MetricCard
            title="Leads"
            value={leads}
            href="/leads"
            icon={
              <UserPlus size={16} />
            }
          />
        )}

        {canViewModule("Customers") && (
          <MetricCard
            title="Customers"
            value={customers}
            href="/customers"
            icon={
              <Users size={16} />
            }
          />
        )}

        {canViewModule("Jobs") && (
          <MetricCard
            title="Jobs"
            value={jobs}
            href="/jobs"
            icon={
              <Briefcase size={16} />
            }
          />
        )}

      </div>

           {/* SUBSCRIPTION */}

      <div className="rounded-3xl border bg-white p-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold">
              Subscription
            </h2>

            <div className="mt-6 space-y-3 text-sm">
              <p>
                Plan
                <span className="ml-2 font-semibold capitalize">
                  {subscription?.plan ??
                    dbUser.organization.plan ??
                    "starter"}
                </span>
              </p>

              <p>
                Status
                <span className="ml-2 font-semibold capitalize">
                  {subscription?.status ?? "unknown"}
                </span>
              </p>

              <p>
                {isTrial ? "Trial ends" : "Renewal date"}
                <span className="ml-2 font-semibold">
                  {subscriptionEnds
                    ? new Date(subscriptionEnds).toLocaleDateString()
                    : "Not available"}
                </span>
              </p>
            </div>

            {isTrial && !expired && daysLeft !== null && (
              <div className="mt-5 inline-flex rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700">
                {daysLeft === 0
                  ? "Less than one day remaining"
                  : `${daysLeft} day${daysLeft === 1 ? "" : "s"} remaining`}
              </div>
            )}

            {expired && (
              <div className="mt-5 inline-flex rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-700">
                Trial or subscription expired
              </div>
            )}

            {isTrial && !expired && (
              <p className="mt-4 text-sm text-slate-500">
                Explore your CRM during the free trial. Upgrade before
                the trial ends to continue using paid features.
              </p>
            )}
          </div>

          <Link
            href="/billing/plans"
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border px-5 text-sm font-medium transition hover:bg-slate-50"
          >
            {isTrial ? "Upgrade" : "Manage"}
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* RECENT ACTIVITY */}

      <div
        className="
          grid
          md:grid-cols-3
          gap-4
        "
      >

        {canViewModule("Leads") && (
          <ActivityCard
            title="Recent Leads"
            items={recentLeads.map(
              (x) =>
                `${x.firstName} ${x.lastName}`
            )}
            href="/leads"
            action="Create First Lead"
            description=
              "You haven't created any leads yet."
          />
        )}

        {canViewModule("Customers") && (
          <ActivityCard
            title="Recent Customers"
            items={recentCustomers.map(
              (x) =>
                `${x.firstName} ${x.lastName}`
            )}
            href="/customers"
            action="Create First Customer"
            description=
              "No customers yet."
          />
        )}

        {canViewModule("Jobs") && (
          <ActivityCard
            title="Recent Jobs"
            items={recentJobs.map(
              (x) => x.title
            )}
            href="/jobs"
            action="Create First Job"
            description=
              "No jobs have been created."
          />
        )}

      </div>

    </div>
  )
}

// ============================================================
// METRIC CARD
// ============================================================

interface MetricCardProps {
  title: string
  value: number
  href: string
  icon: React.ReactNode
}

function MetricCard({
  title,
  value,
  href,
  icon,
}: MetricCardProps) {
  return (
    <Link
      href={href}
      className="
        bg-white
        border
        rounded-3xl
        p-6
        hover:border-slate-300
        transition
      "
    >

      <div
        className="
          flex
          justify-between
          items-center
        "
      >

        <p
          className="
            text-sm
            text-slate-500
          "
        >
          {title}
        </p>

        {icon}

      </div>

      <h2
        className="
          text-5xl
          font-semibold
          mt-4
        "
      >
        {value}
      </h2>

    </Link>
  )
}

// ============================================================
// ACTIVITY CARD
// ============================================================

interface ActivityCardProps {
  title: string
  items: string[]
  href: string
  action: string
  description: string
}

function ActivityCard({
  title,
  items,
  href,
  action,
  description,
}: ActivityCardProps) {
  return (
    <div
      className="
        bg-white
        border
        rounded-3xl
        p-6
      "
    >

      <h3
        className="
          font-medium
          mb-5
        "
      >
        {title}
      </h3>

      <div className="space-y-2">

        {items.length === 0 ? (
          <div
            className="
              rounded-2xl
              border
              border-dashed
              p-6
              text-center
            "
          >

            <p
              className="
                text-sm
                font-medium
              "
            >
              {description}
            </p>

            <Link
              href={href}
              className="
                inline-flex
                mt-4
                rounded-xl
                bg-orange-500
                px-4
                py-2
                text-white
                hover:bg-orange-600
                transition
              "
            >
              {action}
            </Link>

          </div>
        ) : (
          items.map(
            (item, index) => (
              <div
                key={index}
                className="
                  text-sm
                  bg-slate-50
                  rounded-xl
                  px-4
                  py-3
                "
              >
                {item}
              </div>
            )
          )
        )}

      </div>

    </div>
  )
}