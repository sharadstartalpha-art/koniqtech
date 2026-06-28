import {

LayoutDashboard,

Building2,

Users,

UserCog,

Building,

Layers,

Briefcase,

ShieldCheck,

UserPlus,

CreditCard,

Receipt,

CircleDollarSign,

FileText,

BadgeDollarSign,

Target,

Presentation,

ClipboardList,

LucideIcon,

MessageSquare,
Mail,
LifeBuoy,
BookOpen,
Megaphone,
Truck,
Package,
Car,
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
KeyRound,
Webhook,

Settings,
Palette,
Shield,
PlugZap,
HardDrive,
Server

} from "lucide-react"

export interface AdminMenuItem{

label:string

href?:string

icon:LucideIcon

badge?:string

roles?:string[]

children?:AdminMenuItem[]

}

export interface AdminMenuSection{

title:string

items:AdminMenuItem[]

}

export const ADMIN_MENU:AdminMenuSection[]=[

/* -------------------------------------------------- */
/* Dashboard */
/* -------------------------------------------------- */

{

title:"Dashboard",

items:[

{

label:"Dashboard",

href:"/admin/dashboard",

icon:LayoutDashboard

}

]

},

/* -------------------------------------------------- */
/* Platform */
/* -------------------------------------------------- */

{

title:"Platform",

items:[

{

label:"Organizations",

href:"/admin/organizations",

icon:Building2

},

{

label:"Employees",

href:"/admin/employees",

icon:Users,

children:[

{

label:"All Employees",

href:"/admin/employees",

icon:Users

},

{

label:"Departments",

href:"/admin/employees/departments",

icon:Building

},

{

label:"Teams",

href:"/admin/employees/teams",

icon:Layers

},

{

label:"Attendance",

href:"/admin/employees/attendance",

icon:ClipboardList

},

{

label:"Leaves",

href:"/admin/employees/leaves",

icon:Briefcase

},

{

label:"Payroll",

href:"/admin/employees/payroll",

icon:BadgeDollarSign

},

{

label:"Performance",

href:"/admin/employees/performance",

icon:Target

}

]

},

{

label:"Roles",

href:"/admin/roles",

icon:ShieldCheck

},

{

label:"Invitations",

href:"/admin/invitations",

icon:UserPlus

}

]

},

/* -------------------------------------------------- */
/* CRM Products */
/* -------------------------------------------------- */

{

title:"CRM Products",

items:[

{

label:"Roofing CRM",

href:"/admin/products/roofing",

icon:Building2

},

{

label:"HVAC CRM",

href:"/admin/products/hvac",

icon:Building

},

{

label:"Plumbing CRM",

href:"/admin/products/plumbing",

icon:Layers

},

{

label:"Landscaping CRM",

href:"/admin/products/landscaping",

icon:Briefcase

},

{

label:"Construction CRM",

href:"/admin/products/construction",

icon:Building2

},

{

label:"Cleaning CRM",

href:"/admin/products/cleaning",

icon:ClipboardList

},

{

label:"Electrical CRM",

href:"/admin/products/electrical",

icon:ShieldCheck

}

]

},

/* -------------------------------------------------- */
/* Billing */
/* -------------------------------------------------- */

{

title:"Billing",

items:[

{

label:"Plans",

href:"/admin/plans",

icon:CreditCard

},

{

label:"Subscriptions",

href:"/admin/subscriptions",

icon:BadgeDollarSign

},

{

label:"Invoices",

href:"/admin/invoices",

icon:Receipt

},

{

label:"Transactions",

href:"/admin/transactions",

icon:CircleDollarSign

}

]

},

/* -------------------------------------------------- */
/* Sales */
/* -------------------------------------------------- */

{

title:"Sales",

items:[

{

label:"Leads",

href:"/admin/leads",

icon:Target

},

{

label:"Companies",

href:"/admin/companies",

icon:Building2

},

{

label:"Demo Requests",

href:"/admin/demos",

icon:Presentation,

badge:"NEW"

},

{

label:"Opportunities",

href:"/admin/opportunities",

icon:BadgeDollarSign

},

{

label:"Contracts",

href:"/admin/contracts",

icon:FileText

}

]

},

/* -------------------------------------------------- */
/* Marketing */
/* -------------------------------------------------- */

{

title:"Marketing",

items:[

{

label:"Campaigns",

href:"/admin/campaigns",

icon:Target

},

{

label:"Email Queue",

href:"/admin/email-queue",

icon:FileText

},

{

label:"SMS Queue",

href:"/admin/sms-queue",

icon:MessageSquare

},

{

label:"Newsletter",

href:"/admin/newsletter",

icon:Mail

},

{

label:"Templates",

href:"/admin/email-templates",

icon:FileText

}

]

},

/* -------------------------------------------------- */
/* Support */
/* -------------------------------------------------- */

{

title:"Support",

items:[

{

label:"Support Tickets",

href:"/admin/support",

icon:LifeBuoy,

badge:"12"

},

{

label:"Knowledge Base",

href:"/admin/knowledge",

icon:BookOpen

},

{

label:"Live Chat",

href:"/admin/chat",

icon:MessageSquare

},

{

label:"Announcements",

href:"/admin/announcements",

icon:Megaphone

}

]

},

/* -------------------------------------------------- */
/* Operations */
/* -------------------------------------------------- */

{

title:"Operations",

items:[

{

label:"Vendors",

href:"/admin/vendors",

icon:Truck

},

{

label:"Assets",

href:"/admin/assets",

icon:Package

},

{

label:"Fleet",

href:"/admin/fleet",

icon:Car

},

{

label:"Warehouse",

href:"/admin/warehouse",

icon:Warehouse

},

{

label:"Inventory",

href:"/admin/inventory",

icon:Boxes

},

{

label:"Purchase Orders",

href:"/admin/purchase-orders",

icon:ShoppingCart

},

{

label:"Asset Maintenance",

href:"/admin/asset-maintenance",

icon:Wrench

}

]

},

/* -------------------------------------------------- */
/* AI */
/* -------------------------------------------------- */

{

title:"Artificial Intelligence",

items:[

{

label:"AI Dashboard",

href:"/admin/ai",

icon:Brain

},

{

label:"AI Agents",

href:"/admin/ai/agents",

icon:Bot

},

{

label:"AI Usage",

href:"/admin/ai/usage",

icon:Cpu

},

{

label:"AI Logs",

href:"/admin/ai/logs",

icon:FileSearch

}

]

},

/* -------------------------------------------------- */
/* Analytics */
/* -------------------------------------------------- */

{

title:"Analytics",

items:[

{

label:"Revenue",

href:"/admin/analytics/revenue",

icon:BarChart3

},

{

label:"Customers",

href:"/admin/analytics/customers",

icon:Users

},

{

label:"Growth",

href:"/admin/analytics/growth",

icon:TrendingUp

},

{

label:"Reports",

href:"/admin/reports",

icon:PieChart

}

]

},

/* -------------------------------------------------- */
/* Platform */
/* -------------------------------------------------- */

{

title:"Platform",

items:[

{

label:"Monitoring",

href:"/admin/monitoring",

icon:Activity

},

{

label:"Audit Logs",

href:"/admin/audit",

icon:ShieldCheck

},

{

label:"Activity Timeline",

href:"/admin/activity",

icon:History

},

{

label:"Platform Logs",

href:"/admin/platform-logs",

icon:ScrollText

},

{

label:"API Keys",

href:"/admin/api-keys",

icon:KeyRound

},

{

label:"Webhooks",

href:"/admin/webhooks",

icon:Webhook

}

]

},

/* -------------------------------------------------- */
/* Settings */
/* -------------------------------------------------- */

{

title:"Settings",

items:[

{

label:"General",

href:"/admin/settings",

icon:Settings

},

{

label:"Branding",

href:"/admin/settings/branding",

icon:Palette

},

{

label:"Email",

href:"/admin/settings/email",

icon:Mail

},

{

label:"Security",

href:"/admin/settings/security",

icon:Shield

},

{

label:"Integrations",

href:"/admin/settings/integrations",

icon:PlugZap

},

{

label:"Storage",

href:"/admin/settings/storage",

icon:HardDrive

},

{

label:"System",

href:"/admin/settings/system",

icon:Server

}

]

}

]