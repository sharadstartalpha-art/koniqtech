import {
  Industry,
  SubscriptionPlan,
  
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
  ShoppingCart,
} from "lucide-react";

import type { ModuleName } from "@/shared/constants/modules";

export interface MenuChild {
  label: string;
  href: string;
  icon: LucideIcon;

  permission?: ModuleName

  plans?: SubscriptionPlan[];
  industries?: Industry[];
}

export interface MenuItem {
  label: string;
  href: string;
  icon: LucideIcon;

 permission?: ModuleName

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
        permission: "Dashboard",
        icon: LayoutDashboard,

       

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
        permission: "Leads",
        icon: Users,

       

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
        permission: "Customers",
        icon: Users,

       

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
        permission: "Pipeline",
        icon: GitBranch,


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
        permission: "Quotes",
        icon: FileText,

        

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
        permission: "Jobs",
        icon: Briefcase,

        

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
        label: "Vendors",
        href: "/vendors",
        permission: "Vendors",
        icon: Truck,

        

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
        label: "Purchase Orders",
         href: "/purchase-orders",
         permission: "Purchase Orders",
         icon: ShoppingCart,

        

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
        permission: "Crew",
        icon: Users,

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
        href: "/dispatch",
        permission: "Dispatch",
        icon: Truck,

       

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
        permission: "Calendar",
        icon: Calendar,

        

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
        permission: "Inventory",
        icon: Package,

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
        permission: "Billing",
        icon: CreditCard,

        
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
        permission: "Invoices",
        icon: FileText,


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
        permission: "Reports",
        icon: BarChart3,


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
        permission: "Messages",
        icon: MessageSquare,


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
        permission: "Notifications",
        icon: Bell,

        

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
        permission: "AI Assistant",
        icon: Brain,

        

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
        permission: "Profile",
        icon: UserCog,

        
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
        permission: "Change Password",
        icon: Settings,


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
        permission: "Team",
        icon: UserCog,


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
        permission: "Settings",
        icon: Settings,

        

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
            permission: "Company",
            icon: Building2,
          },
          {
            label: "Organization",
            href: "/settings/organization",
             permission: "Organization",
            icon: Building,
          },
          
          {
            label: "Branding",
            href: "/settings/branding",
            permission: "Branding",
            icon: Palette,
          },
          {
            label: "Invitations",
            href: "/settings/invitations",
             permission: "Invitations",
            icon: Mail,
          },
          {
            label: "Roles & Permissions",
            href: "/settings/roles",
             permission: "Roles & Permissions",
            icon: ShieldCheck,
          },
          {
            label: "Billing",
            href: "/settings/billing",
            permission: "Billing",
            icon: CreditCard,
          },
          {
  label: "Integrations",
  href: "/settings/integrations",
  permission: "Integrations",
  icon: Plug,

  plans: [
    SubscriptionPlan.professional,
    SubscriptionPlan.enterprise,
  ],
},
          {
  label: "AI Settings",
  href: "/settings/ai",
  permission: "AI Settings",
  icon: Brain,

  plans: [
    SubscriptionPlan.professional,
    SubscriptionPlan.enterprise,
  ],
},
          {
            label: "Email Templates",
            href: "/settings/email-templates",
            permission: "Email Templates",
            icon: MailOpen,
          },
          {
            label: "Notifications",
            href: "/settings/notifications",
            permission: "Notifications",
            icon: Bell,
          },
        ],
      },
    ],
  },
];



