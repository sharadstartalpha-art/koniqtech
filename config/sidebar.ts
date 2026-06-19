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
  LucideIcon 
} from "lucide-react"


export type MenuItem = {
  label: string
  href: string
  icon: LucideIcon
  roles?: string[]
  children?: {
    label: string
    href: string
  }[]
}

export type MenuSection = {
  title: string
  items: MenuItem[]
}



export const MENU = [

  {
    title:"Sales",

    items:[
      {
        label:"Dashboard",
        href:"/dashboard",
        icon:LayoutDashboard,
        roles:[
          "owner",
          "admin",
          "manager",
          "sales",
          "technician",
          "support",
          "accountant"
        ]
      },

      {
        label:"Leads",
        href:"/leads",
        icon:Users,
        roles:[
          "owner",
          "admin",
          "manager",
          "sales"
        ]
      },

      {
        label:"Customers",
        href:"/customers",
        icon:Users,
        roles:[
          "owner",
          "admin",
          "manager",
          "sales",
          "support"
        ]
      },

      {
        label:"Pipeline",
        href:"/pipeline",
        icon:GitBranch,
        roles:[
          "owner",
          "admin",
          "manager",
          "sales"
        ]
      },

      {
        label:"Quotes",
        href:"/quotes",
        icon:FileText,
        roles:[
          "owner",
          "admin",
          "manager",
          "sales"
        ]
      }
    ]
  },

  {
    title:"Operations",

    items:[
      {
        label:"Jobs",
        href:"/jobs",
        icon:Briefcase,
        roles:[
          "owner",
          "admin",
          "manager",
          "technician"
        ]
      },

      {
        label:"Crew",
        href:"/crew",
        icon:Users,
        roles:[
          "owner",
          "admin",
          "manager"
        ]
      },

      {
        label:"Dispatch",
        href:"/jobs/dispatch",
        icon:Truck,
        roles:[
          "owner",
          "admin",
          "manager"
        ]
      },

      {
        label:"Calendar",
        href:"/calendar",
        icon:Calendar,
        roles:[
          "owner",
          "admin",
          "manager",
          "sales",
          "technician"
        ]
      },

      {
        label:"Inventory",
        href:"/inventory",
        icon:Package,
        roles:[
          "owner",
          "admin",
          "manager"
        ]
      },

      {
        label:"Documents",
        href:"/documents",
        icon:FileText,
        roles:[
          "owner",
          "admin",
          "manager"
        ]
      }
    ]
  },

  {
    title:"Finance",

    items:[
      {
        label:"Billing",
        href:"/billing",
        icon:CreditCard,
        roles:[
          "owner",
          "admin",
          "accountant"
        ]
      },

      {
        label:"Reports",
        href:"/reports",
        icon:BarChart3,
        roles:[
          "owner",
          "admin",
          "manager"
        ]
      }
    ]
  },

  {
    title:"Communication",

    items:[
      {
        label:"Messages",
        href:"/messages",
        icon:MessageSquare,
        roles:[
          "owner",
          "admin",
          "manager",
          "sales",
          "support"
        ]
      },

      {
        label:"Notifications",
        href:"/notifications",
        icon:Bell,
        roles:[
          "owner",
          "admin",
          "manager",
          "sales",
          "support"
        ]
      }
    ]
  },

  {
    title:"Intelligence",

    items:[
      {
        label:"AI",
        href:"/ai",
        icon:Brain,
        roles:[
          "owner",
          "admin",
          "manager"
        ]
      }
    ]
  },

{
  title:"My Account",

  items:[
    {
      label:"Profile",
      href:"/profile",
      icon:UserCog,

      roles:[
        "owner",
        "admin",
        "manager",
        "sales",
        "technician",
        "support",
        "accountant"
      ]
    },

    {
      label:"Change Password",
      href:"/profile/security",
      icon:Settings,

      roles:[
        "owner",
        "admin",
        "manager",
        "sales",
        "technician",
        "support",
        "accountant"
      ]
    }
  ]
},



  {
  title:"Administration",

  items:[

    {
      label:"Team",
      href:"/settings/team",
      icon:UserCog,

      roles:[
        "owner",
        "admin",
        "manager"
      ]
    },

    {
      label:"Settings",
      href:"/settings",
      icon:Settings,

      roles:[
        "owner",
        "admin",
        "manager"
      ],

      children:[
        {
          label:"Company",
          href:"/settings/company"
        },
        {
          label:"Organization",
          href:"/settings/organization"
        },
        {
          label:"Branding",
          href:"/settings/branding"
        },
        {
          label:"Team Members",
          href:"/settings/team"
        },
        {
          label:"Invitations",
          href:"/settings/invitations"
        },
        {
          label:"Roles & Permissions",
          href:"/settings/roles"
        },
        {
          label:"Billing",
          href:"/settings/billing"
        },
        {
          label:"Integrations",
          href:"/settings/integrations"
        },
        {
          label:"AI Settings",
          href:"/settings/ai"
        },
        {
          label:"Email Templates",
          href:"/settings/email-templates"
        },
        {
          label:"Notifications",
          href:"/settings/notifications"
        }
      ]
    }
  ]
}

]