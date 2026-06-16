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
  UserCog
} from "lucide-react"

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
    title:"Administration",

    items:[
      {
        label:"Team",
        href:"/settings/team",
        icon:UserCog,
        roles:[
          "owner",
          "admin"
        ]
      },

      {
        label:"Settings",
        href:"/settings",
        icon:Settings,
        roles:[
          "owner",
          "admin"
        ]
      }
    ]
  }

]