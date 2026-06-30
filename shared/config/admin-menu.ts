import {
  LayoutDashboard,

  Building2,
  Building,

  Users,
  UserCog,
  UserPlus,

  Layers,

  ShieldCheck,

  CreditCard,
  Receipt,
  CircleDollarSign,
  BadgeDollarSign,

  ClipboardList,
  Briefcase,

  Target,
  Presentation,

  Megaphone,
  Mail,
  MessageSquare,

  LifeBuoy,
  BookOpen,

  Truck,
  Car,
  Package,
  Warehouse,
  Boxes,
  ShoppingCart,
  Wrench,

  Brain,
  Bot,
  Cpu,
  FileSearch,

  BarChart3,
  TrendingUp,
  PieChart,

  Activity,
  History,
  ScrollText,

  FileText,

  Database,

  KeyRound,
  Webhook,

  Settings,
  Palette,
  Shield,
  PlugZap,

  HardDrive,
  Server,

  LucideIcon,
} from "lucide-react"

/* ===========================================================
   TYPES
=========================================================== */

export interface AdminMenuItem {
  label: string

  href?: string

  icon: LucideIcon

  badge?: string

  children?: AdminMenuItem[]
}

export interface AdminMenuSection {
  title: string

  items: AdminMenuItem[]
}

/* ===========================================================
   ROLE KEYS
=========================================================== */

export const ROLE = {
  SUPER_ADMIN: "super_admin",

  PLATFORM_MANAGER: "manager",

  SALES: "sales",

  MARKETING: "marketing",

  ACCOUNTANT: "accountant",

  SUPPORT: "support",

  DATA_ENTRY: "data_entry",
} as const

export type AdminRole =
  (typeof ROLE)[keyof typeof ROLE]

/* ===========================================================
   COMMON MENU ITEMS
=========================================================== */

const Dashboard: AdminMenuItem = {
  label: "Dashboard",
  href: "/admin/dashboard",
  icon: LayoutDashboard,
}

const Organizations: AdminMenuItem = {
  label: "Organizations",
  href: "/admin/organizations",
  icon: Building2,
}

const Employees: AdminMenuItem = {
  label: "Employees",
  href: "/admin/employees",
  icon: Users,
}

const Departments: AdminMenuItem = {
  label: "Departments",
  href: "/admin/departments",
  icon: Building,
}

const Teams: AdminMenuItem = {
  label: "Teams",
  href: "/admin/teams",
  icon: Layers,
}

const Roles: AdminMenuItem = {
  label: "Roles",
  href: "/admin/roles",
  icon: ShieldCheck,
}

const Attendance: AdminMenuItem = {
  label: "Attendance",
  href: "/admin/attendance",
  icon: ClipboardList,
}

const Payroll: AdminMenuItem = {
  label: "Payroll",
  href: "/admin/payroll",
  icon: BadgeDollarSign,
}

const Companies: AdminMenuItem = {
  label: "Companies",
  href: "/admin/companies",
  icon: Building2,
}

const Leads: AdminMenuItem = {
  label: "Leads",
  href: "/admin/leads",
  icon: Target,
}

const DemoRequests: AdminMenuItem = {
  label: "Demo Requests",
  href: "/admin/demos",
  icon: Presentation,
  badge: "NEW",
}

const Campaigns: AdminMenuItem = {
  label: "Campaigns",
  href: "/admin/campaigns",
  icon: Megaphone,
}

const EmailCenter: AdminMenuItem = {
  label: "Email Center",
  href: "/admin/email-center",
  icon: Mail,
}

const Newsletter: AdminMenuItem = {
  label: "Newsletter",
  href: "/admin/newsletter",
  icon: Mail,
}

const Templates: AdminMenuItem = {
  label: "Templates",
  href: "/admin/email-templates",
  icon: FileText,
}

const Subscriptions: AdminMenuItem = {
  label: "Subscriptions",
  href: "/admin/subscriptions",
  icon: CreditCard,
}

const Plans: AdminMenuItem = {
  label: "Plans",
  href: "/admin/plans",
  icon: BadgeDollarSign,
}

const Coupons: AdminMenuItem = {
  label: "Coupons",
  href: "/admin/coupons",
  icon: Receipt,
}

const Invoices: AdminMenuItem = {
  label: "Invoices",
  href: "/admin/invoices",
  icon: Receipt,
}

const Transactions: AdminMenuItem = {
  label: "Transactions",
  href: "/admin/transactions",
  icon: CircleDollarSign,
}

/* ===========================================================
   PART 2 CONTINUES HERE
=========================================================== */

/* ===========================================================
   SUPER ADMIN MENU
=========================================================== */

export const SUPER_ADMIN_MENU: AdminMenuSection[] = [

  /* ------------------------------------------------------ */
  /* Dashboard */
  /* ------------------------------------------------------ */

  {
    title: "Dashboard",

    items: [
      Dashboard,
    ],
  },

  /* ------------------------------------------------------ */
  /* Platform */
  /* ------------------------------------------------------ */

  {
    title: "Platform",

    items: [

      Organizations,

      Subscriptions,

      Plans,

      Coupons,

    ],
  },

  /* ------------------------------------------------------ */
  /* People */
  /* ------------------------------------------------------ */

  {
    title: "People",

    items: [

      Employees,

      Departments,

      Teams,

      Roles,

      Attendance,

      Payroll,

    ],
  },

  /* ------------------------------------------------------ */
  /* Sales */
  /* ------------------------------------------------------ */

  {
    title: "Sales",

    items: [

      Companies,

      Leads,

      DemoRequests,

    ],
  },

  /* ------------------------------------------------------ */
  /* Operations */
  /* ------------------------------------------------------ */

  {
    title: "Operations",

    items: [

      {
        label: "Vendors",
        href: "/admin/vendors",
        icon: Truck,
      },

      {
        label: "Fleet",
        href: "/admin/fleet",
        icon: Car,
      },

      {
        label: "Assets",
        href: "/admin/assets",
        icon: Package,
      },

      {
        label: "Warehouse",
        href: "/admin/warehouse",
        icon: Warehouse,
      },

      {
        label: "Inventory",
        href: "/admin/inventory",
        icon: Boxes,
      },

      {
        label: "Purchase Orders",
        href: "/admin/purchase-orders",
        icon: ShoppingCart,
      },

      {
        label: "Asset Maintenance",
        href: "/admin/asset-maintenance",
        icon: Wrench,
      },

    ],
  },

  /* ------------------------------------------------------ */
  /* Artificial Intelligence */
  /* ------------------------------------------------------ */

  {
    title: "Artificial Intelligence",

    items: [

      {
        label: "AI Dashboard",
        href: "/admin/ai",
        icon: Brain,
      },

      {
        label: "AI Agents",
        href: "/admin/ai/agents",
        icon: Bot,
      },

      {
        label: "AI Usage",
        href: "/admin/ai/usage",
        icon: Cpu,
      },

      {
        label: "AI Logs",
        href: "/admin/ai/logs",
        icon: FileSearch,
      },

    ],
  },

  /* ------------------------------------------------------ */
  /* Analytics */
  /* ------------------------------------------------------ */

  {
    title: "Analytics",

    items: [

      {
        label: "Revenue",
        href: "/admin/analytics/revenue",
        icon: BarChart3,
      },

      {
        label: "Customers",
        href: "/admin/analytics/customers",
        icon: Users,
      },

      {
        label: "Growth",
        href: "/admin/analytics/growth",
        icon: TrendingUp,
      },

      {
        label: "Reports",
        href: "/admin/reports",
        icon: PieChart,
      },

    ],
  },

  /* ------------------------------------------------------ */
  /* System */
  /* ------------------------------------------------------ */

  {
    title: "System",

    items: [

      {
        label: "Monitoring",
        href: "/admin/monitoring",
        icon: Activity,
      },

      {
        label: "Logs",
        href: "/admin/platform-logs",
        icon: ScrollText,
      },

      {
        label: "Activity Timeline",
        href: "/admin/activity",
        icon: History,
      },

      {
        label: "Database",
        href: "/admin/database",
        icon: Database,
      },

      {
        label: "API Keys",
        href: "/admin/api-keys",
        icon: KeyRound,
      },

      {
        label: "Webhooks",
        href: "/admin/webhooks",
        icon: Webhook,
      },

    ],
  },

  /* ------------------------------------------------------ */
  /* Settings */
  /* ------------------------------------------------------ */

  {
    title: "Settings",

    items: [

      {
        label: "General",
        href: "/admin/settings",
        icon: Settings,
      },

      {
        label: "Branding",
        href: "/admin/settings/branding",
        icon: Palette,
      },

      {
        label: "Email",
        href: "/admin/settings/email",
        icon: Mail,
      },

      {
        label: "Security",
        href: "/admin/settings/security",
        icon: Shield,
      },

      {
        label: "Integrations",
        href: "/admin/settings/integrations",
        icon: PlugZap,
      },

      {
        label: "Storage",
        href: "/admin/settings/storage",
        icon: HardDrive,
      },

      {
        label: "System",
        href: "/admin/settings/system",
        icon: Server,
      },

    ],
  },

]

/* ===========================================================
   PART 3 CONTINUES HERE
=========================================================== */
/* ===========================================================
   PLATFORM MANAGER MENU
=========================================================== */

export const PLATFORM_MANAGER_MENU: AdminMenuSection[] = [

  /* ------------------------------------------------------ */
  /* Dashboard */
  /* ------------------------------------------------------ */

  {
    title: "Dashboard",

    items: [
      Dashboard,
    ],
  },

  /* ------------------------------------------------------ */
  /* Platform */
  /* ------------------------------------------------------ */

  {
    title: "Platform",

    items: [

      Organizations,

      Subscriptions,

      Plans,

    ],
  },

  /* ------------------------------------------------------ */
  /* People */
  /* ------------------------------------------------------ */

  {
    title: "People",

    items: [

      Employees,

      Departments,

      Teams,

      Roles,

      Attendance,

      Payroll,

    ],
  },

  /* ------------------------------------------------------ */
  /* Sales */
  /* ------------------------------------------------------ */

  {
    title: "Sales",

    items: [

      Companies,

      Leads,

      DemoRequests,

    ],
  },

  /* ------------------------------------------------------ */
  /* Operations */
  /* ------------------------------------------------------ */

  {
    title: "Operations",

    items: [

      {
        label: "Vendors",
        href: "/admin/vendors",
        icon: Truck,
      },

      {
        label: "Fleet",
        href: "/admin/fleet",
        icon: Car,
      },

      {
        label: "Assets",
        href: "/admin/assets",
        icon: Package,
      },

      {
        label: "Warehouse",
        href: "/admin/warehouse",
        icon: Warehouse,
      },

      {
        label: "Inventory",
        href: "/admin/inventory",
        icon: Boxes,
      },

      {
        label: "Purchase Orders",
        href: "/admin/purchase-orders",
        icon: ShoppingCart,
      },

      {
        label: "Asset Maintenance",
        href: "/admin/asset-maintenance",
        icon: Wrench,
      },

    ],
  },

  /* ------------------------------------------------------ */
  /* Analytics */
  /* ------------------------------------------------------ */

  {
    title: "Analytics",

    items: [

      {
        label: "Revenue",
        href: "/admin/analytics/revenue",
        icon: BarChart3,
      },

      {
        label: "Customers",
        href: "/admin/analytics/customers",
        icon: Users,
      },

      {
        label: "Growth",
        href: "/admin/analytics/growth",
        icon: TrendingUp,
      },

      {
        label: "Reports",
        href: "/admin/reports",
        icon: PieChart,
      },

    ],
  },

]

/* ===========================================================
   PART 4 CONTINUES HERE
=========================================================== */
/* ===========================================================
   SALES MENU
=========================================================== */

export const SALES_MENU: AdminMenuSection[] = [

  {
    title: "Dashboard",

    items: [
      Dashboard,
    ],
  },

  {
    title: "Sales",

    items: [

      Companies,

      Leads,

      DemoRequests,

    ],
  },

  {
    title: "Marketing",

    items: [

      Campaigns,

      EmailCenter,

      Newsletter,

      Templates,

    ],
  },

]

/* ===========================================================
   MARKETING MENU
=========================================================== */

export const MARKETING_MENU: AdminMenuSection[] = [

  {
    title: "Dashboard",

    items: [
      Dashboard,
    ],
  },

  {
    title: "Marketing",

    items: [

      Campaigns,

      EmailCenter,

      Newsletter,

      Templates,

    ],
  },

  {
    title: "Communication",

    items: [

      {
        label: "SMS Queue",
        href: "/admin/sms-queue",
        icon: MessageSquare,
      },

      {
        label: "Email Queue",
        href: "/admin/email-queue",
        icon: Mail,
      },

    ],
  },

]

/* ===========================================================
   PART 5 CONTINUES HERE
=========================================================== */
/* ===========================================================
   ACCOUNTANT MENU
=========================================================== */

export const ACCOUNTANT_MENU: AdminMenuSection[] = [

  {
    title: "Dashboard",

    items: [
      Dashboard,
    ],
  },

  {
    title: "Billing",

    items: [

      Subscriptions,

      Plans,

      Invoices,

      Transactions,

    ],
  },

  {
    title: "Payroll",

    items: [

      Payroll,

    ],
  },

  {
    title: "Reports",

    items: [

      {
        label: "Revenue Reports",
        href: "/admin/reports/revenue",
        icon: BarChart3,
      },

      {
        label: "Financial Reports",
        href: "/admin/reports/financial",
        icon: PieChart,
      },

      {
        label: "Invoices",
        href: "/admin/reports/invoices",
        icon: Receipt,
      },

    ],
  },

]

/* ===========================================================
   SUPPORT MENU
=========================================================== */

export const SUPPORT_MENU: AdminMenuSection[] = [

  {
    title: "Dashboard",

    items: [
      Dashboard,
    ],
  },

  {
    title: "Organizations",

    items: [

      Organizations,

    ],
  },

  {
    title: "Support",

    items: [

      {
        label: "Tickets",
        href: "/admin/support",
        icon: LifeBuoy,
      },

      {
        label: "Knowledge Base",
        href: "/admin/knowledge",
        icon: BookOpen,
      },

      {
        label: "Announcements",
        href: "/admin/announcements",
        icon: Megaphone,
      },

    ],
  },

]

/* ===========================================================
   DATA ENTRY MENU
=========================================================== */

export const DATA_ENTRY_MENU: AdminMenuSection[] = [

  {
    title: "Dashboard",

    items: [
      Dashboard,
    ],
  },

  {
    title: "Platform",

    items: [

      Organizations,

    ],
  },

  {
    title: "Sales",

    items: [

      Companies,

      Leads,

    ],
  },

]

/* ===========================================================
   MENU BY ROLE
=========================================================== */

export const MENU_BY_ROLE: Record<
  AdminRole,
  AdminMenuSection[]
> = {

  [ROLE.SUPER_ADMIN]:
    SUPER_ADMIN_MENU,

  [ROLE.PLATFORM_MANAGER]:
    PLATFORM_MANAGER_MENU,

  [ROLE.SALES]:
    SALES_MENU,

  [ROLE.MARKETING]:
    MARKETING_MENU,

  [ROLE.ACCOUNTANT]:
    ACCOUNTANT_MENU,

  [ROLE.SUPPORT]:
    SUPPORT_MENU,

  [ROLE.DATA_ENTRY]:
    DATA_ENTRY_MENU,

}