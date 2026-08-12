import {
  Industry,
  SubscriptionPlan,
  UserRole,
} from "@prisma/client";

import {
  LayoutDashboard,
  Users,
  GitBranch,
  Briefcase,
  Calendar,
  MessageSquare,
  CreditCard,
  Truck,
  BarChart3,
  Brain,
  Bell,
  Settings,
  FileText,
  Package,
  UserCog,
  Palette,
  Building,
  Building2,
  Mail,
  MailOpen,
  Plug,
  ShieldCheck,
  LucideIcon,
} from "lucide-react";



export interface MenuChild {
  label: string;
  href: string;
  icon: LucideIcon;

  roles?: UserRole[];
  plans?: SubscriptionPlan[];
  industries?: Industry[];
}

export interface MenuItem {
  label: string;
  href: string;
  icon: LucideIcon;

  roles?: UserRole[];
  plans?: SubscriptionPlan[];
  industries?: Industry[];

  children?: MenuChild[];
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

export const MENU: MenuSection[] = [
  {
    title: "Sales",

    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,

        roles: [
          UserRole.owner,
          UserRole.manager,
          UserRole.sales,
          UserRole.dispatcher,
          UserRole.technician,
          UserRole.crew,
          UserRole.accountant,
        ],

        plans: [
          
          SubscriptionPlan.starter,
          SubscriptionPlan.professional,
          SubscriptionPlan.enterprise,
        ],

        industries: [
          Industry.roofing,
          Industry.hvac,
          Industry.plumbing,
          Industry.landscaping,
        ],
      },

      {
        label: "Leads",
        href: "/leads",
        icon: Users,

        roles: [
          UserRole.owner,
          UserRole.manager,
          UserRole.sales,
        ],

        plans: [
          
          SubscriptionPlan.starter,
          SubscriptionPlan.professional,
          SubscriptionPlan.enterprise,
        ],

        industries: [
          Industry.roofing,
          Industry.hvac,
          Industry.plumbing,
          Industry.landscaping,
        ],
      },

      {
        label: "Customers",
        href: "/customers",
        icon: Users,

        roles: [
          UserRole.owner,
          UserRole.manager,
          UserRole.sales,
        ],

        plans: [
          SubscriptionPlan.starter,
          SubscriptionPlan.professional,
          SubscriptionPlan.enterprise,
        ],

        industries: [
          Industry.roofing,
          Industry.hvac,
          Industry.plumbing,
          Industry.landscaping,
        ],
      },

      {
        label: "Pipeline",
        href: "/pipeline",
        icon: GitBranch,

        roles: [
          UserRole.owner,
          UserRole.manager,
          UserRole.sales,
        ],

        plans: [
          SubscriptionPlan.starter,
          SubscriptionPlan.professional,
          SubscriptionPlan.enterprise,
        ],

        industries: [
          Industry.roofing,
          Industry.hvac,
          Industry.plumbing,
          Industry.landscaping,
        ],
      },

      {
        label: "Quotes",
        href: "/quotes",
        icon: FileText,

        roles: [
          UserRole.owner,
          UserRole.manager,
          UserRole.sales,
        ],

        plans: [
          
          SubscriptionPlan.starter,
          SubscriptionPlan.professional,
          SubscriptionPlan.enterprise,
        ],

        industries: [
          Industry.roofing,
          Industry.hvac,
          Industry.plumbing,
          Industry.landscaping,
        ],
      },
    ],
  },

    {
    title: "Operations",

    items: [
      {
        label: "Jobs",
        href: "/jobs",
        icon: Briefcase,

        roles: [
          UserRole.owner,
          UserRole.manager,
          UserRole.dispatcher,
          UserRole.technician,
          UserRole.crew,
        ],

        plans: [
          
          SubscriptionPlan.starter,
          SubscriptionPlan.professional,
          SubscriptionPlan.enterprise,
        ],

        industries: [
          Industry.roofing,
          Industry.hvac,
          Industry.plumbing,
          Industry.landscaping,
        ],
      },

      {
        label: "Crew",
        href: "/crew",
        icon: Users,

        roles: [
          UserRole.owner,
          UserRole.manager,
        ],

        plans: [
          SubscriptionPlan.starter,
          SubscriptionPlan.professional,
          SubscriptionPlan.enterprise,
        ],

        industries: [
          Industry.roofing,
          Industry.hvac,
          Industry.plumbing,
          Industry.landscaping,
        ],
      },

      {
        label: "Dispatch",
        href: "/jobs/dispatch",
        icon: Truck,

        roles: [
          UserRole.owner,
          UserRole.manager,
          UserRole.dispatcher,
        ],

        plans: [
          SubscriptionPlan.starter,
          SubscriptionPlan.professional,
          SubscriptionPlan.enterprise,
        ],

        industries: [
          Industry.roofing,
          Industry.hvac,
          Industry.plumbing,
          Industry.landscaping,
        ],
      },

      {
        label: "Calendar",
        href: "/calendar",
        icon: Calendar,

        roles: [
          UserRole.owner,
          UserRole.manager,
          UserRole.sales,
          UserRole.dispatcher,
          UserRole.technician,
          UserRole.crew,
        ],

        plans: [
          
          SubscriptionPlan.starter,
          SubscriptionPlan.professional,
          SubscriptionPlan.enterprise,
        ],

        industries: [
          Industry.roofing,
          Industry.hvac,
          Industry.plumbing,
          Industry.landscaping,
        ],
      },

      {
        label: "Inventory",
        href: "/inventory",
        icon: Package,

        roles: [
          UserRole.owner,
          UserRole.manager,
        ],

        plans: [
          SubscriptionPlan.professional,
          SubscriptionPlan.enterprise,
        ],

        industries: [
          Industry.roofing,
          Industry.hvac,
          Industry.plumbing,
          Industry.landscaping,
        ],
      },
    ],
  },

  {
    title: "Finance",

    items: [
      {
        label: "Billing",
        href: "/billing",
        icon: CreditCard,

        roles: [
          UserRole.owner,
          UserRole.accountant,
        ],

        plans: [
          
          SubscriptionPlan.starter,
          SubscriptionPlan.professional,
          SubscriptionPlan.enterprise,
        ],

        industries: [
          Industry.roofing,
          Industry.hvac,
          Industry.plumbing,
          Industry.landscaping,
        ],
      },

      {
        label: "Invoices",
        href: "/invoices",
        icon: FileText,

        roles: [
          UserRole.owner,
          UserRole.accountant,
          UserRole.manager,
        ],

        plans: [
          
          SubscriptionPlan.starter,
          SubscriptionPlan.professional,
          SubscriptionPlan.enterprise,
        ],

        industries: [
          Industry.roofing,
          Industry.hvac,
          Industry.plumbing,
          Industry.landscaping,
        ],
      },

      {
        label: "Reports",
        href: "/reports",
        icon: BarChart3,

        roles: [
          UserRole.owner,
          UserRole.manager,
          UserRole.accountant,
        ],

        plans: [
          SubscriptionPlan.starter,
          SubscriptionPlan.professional,
          SubscriptionPlan.enterprise,
        ],

        industries: [
          Industry.roofing,
          Industry.hvac,
          Industry.plumbing,
          Industry.landscaping,
        ],
      },
    ],
  },

    {
    title: "Communication",

    items: [
      {
        label: "Messages",
        href: "/messages",
        icon: MessageSquare,

        roles: [
          UserRole.owner,
          UserRole.manager,
          UserRole.sales,
          UserRole.dispatcher,
          UserRole.technician,
          UserRole.crew,
          UserRole.accountant,
        ],

        plans: [
          SubscriptionPlan.starter,
          SubscriptionPlan.professional,
          SubscriptionPlan.enterprise,
        ],

        industries: [
          Industry.roofing,
          Industry.hvac,
          Industry.plumbing,
          Industry.landscaping,
        ],
      },

      {
        label: "Notifications",
        href: "/notifications",
        icon: Bell,

        roles: [
          UserRole.owner,
          UserRole.manager,
          UserRole.sales,
          UserRole.dispatcher,
          UserRole.technician,
          UserRole.crew,
          UserRole.accountant,
        ],

        plans: [
          
          SubscriptionPlan.starter,
          SubscriptionPlan.professional,
          SubscriptionPlan.enterprise,
        ],

        industries: [
          Industry.roofing,
          Industry.hvac,
          Industry.plumbing,
          Industry.landscaping,
        ],
      },
    ],
  },

  {
    title: "Intelligence",

    items: [
      {
        label: "AI Assistant",
        href: "/ai",
        icon: Brain,

        roles: [
          UserRole.owner,
          UserRole.manager,
        ],

        plans: [
          SubscriptionPlan.professional,
          SubscriptionPlan.enterprise,
        ],

        industries: [
          Industry.roofing,
          Industry.hvac,
          Industry.plumbing,
          Industry.landscaping,
        ],
      },
    ],
  },

  {
    title: "My Account",

    items: [
      {
        label: "Profile",
        href: "/profile",
        icon: UserCog,

        roles: [
          UserRole.owner,
          UserRole.manager,
          UserRole.sales,
          UserRole.dispatcher,
          UserRole.technician,
          UserRole.crew,
          UserRole.accountant,
        ],

        plans: [
          
          SubscriptionPlan.starter,
          SubscriptionPlan.professional,
          SubscriptionPlan.enterprise,
        ],

        industries: [
          Industry.roofing,
          Industry.hvac,
          Industry.plumbing,
          Industry.landscaping,
        ],
      },

      {
        label: "Change Password",
        href: "/profile/security",
        icon: Settings,

        roles: [
          UserRole.owner,
          UserRole.manager,
          UserRole.sales,
          UserRole.dispatcher,
          UserRole.technician,
          UserRole.crew,
          UserRole.accountant,
        ],

        plans: [
          
          SubscriptionPlan.starter,
          SubscriptionPlan.professional,
          SubscriptionPlan.enterprise,
        ],

        industries: [
          Industry.roofing,
          Industry.hvac,
          Industry.plumbing,
          Industry.landscaping,
        ],
      },
    ],
  },

  {
    title: "Administration",

    items: [
      {
        label: "Team",
        href: "/settings/team",
        icon: UserCog,

        roles: [
          UserRole.owner,
          UserRole.manager,
        ],

        plans: [
          SubscriptionPlan.starter,
          SubscriptionPlan.professional,
          SubscriptionPlan.enterprise,
        ],

        industries: [
          Industry.roofing,
          Industry.hvac,
          Industry.plumbing,
          Industry.landscaping,
        ],
      },

      {
        label: "Settings",
        href: "/settings",
        icon: Settings,

        roles: [
          UserRole.owner,
          UserRole.manager,
        ],

        plans: [
          SubscriptionPlan.starter,
          SubscriptionPlan.professional,
          SubscriptionPlan.enterprise,
        ],

        industries: [
          Industry.roofing,
          Industry.hvac,
          Industry.plumbing,
          Industry.landscaping,
        ],

        children: [
          {
            label: "Company",
            href: "/settings/company",
            icon: Building2,
          },
          {
            label: "Organization",
            href: "/settings/organization",
            icon: Building,
          },
          {
            label: "Branding",
            href: "/settings/branding",
            icon: Palette,
          },
          {
            label: "Invitations",
            href: "/settings/invitations",
            icon: Mail,
          },
          {
            label: "Roles & Permissions",
            href: "/settings/roles",
            icon: ShieldCheck,
          },
          {
            label: "Billing",
            href: "/settings/billing",
            icon: CreditCard,
          },
          {
  label: "Integrations",
  href: "/settings/integrations",
  icon: Plug,

  plans: [
    SubscriptionPlan.professional,
    SubscriptionPlan.enterprise,
  ],
},
          {
  label: "AI Settings",
  href: "/settings/ai",
  icon: Brain,

  plans: [
    SubscriptionPlan.professional,
    SubscriptionPlan.enterprise,
  ],
},
          {
            label: "Email Templates",
            href: "/settings/email-templates",
            icon: MailOpen,
          },
          {
            label: "Notifications",
            href: "/settings/notifications",
            icon: Bell,
          },
        ],
      },
    ],
  },
];



