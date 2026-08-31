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



export interface MenuChild {
  label: string;
  href: string;
  icon: LucideIcon;

  roles?: string[];
  plans?: SubscriptionPlan[];
  industries?: Industry[];
}

export interface MenuItem {
  label: string;
  href: string;
  icon: LucideIcon;

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



