"use client"

import Link from "next/link"
import Image from "next/image"

import {
    usePathname
} from "next/navigation"

import {
    useState,
    useMemo
} from "react"

import {
    LayoutDashboard,
    Building2,
    Users,
    UserCog,
    ShieldCheck,
    CreditCard,
    BarChart3,
    Brain,
    Bell,
    Database,
    Settings,
    Search,
    ChevronRight,
    ChevronDown,
    FolderKanban,
    Ticket,
    ClipboardList,
    Megaphone,
    Mail,
    Cpu,
    Activity,
    FileText,
    Server,
    Globe,
    HardDrive,
    Wallet,
    Building,
    Receipt,
    BookOpen,
    KeyRound,
    Webhook,
    Boxes,
    LucideIcon
} from "lucide-react"

import clsx from "clsx"

import SidebarFooter from "./SidebarFooter"





export interface AdminMenuItem{

    label:string

    href?:string

    icon:LucideIcon

    badge?:string

    children?:AdminMenuItem[]

}





const MENU:AdminMenuItem[]=[

{
    label:"Dashboard",

    href:"/admin/dashboard",

    icon:LayoutDashboard
},

{

label:"Platform",

icon:Building2,

children:[

{
label:"Organizations",
href:"/admin/organizations",
icon:Building2
},

{
label:"Subscriptions",
href:"/admin/subscriptions",
icon:CreditCard
},

{
label:"Plans",
href:"/admin/plans",
icon:Wallet
},

{
label:"Coupons",
href:"/admin/coupons",
icon:Receipt
}

]

},

{

label:"Employees",

icon:Users,

children:[

{
label:"Employees",
href:"/admin/employees",
icon:Users
},

{
label:"Departments",
href:"/admin/departments",
icon:Building
},

{
label:"Teams",
href:"/admin/teams",
icon:FolderKanban
},

{
label:"Roles",
href:"/admin/roles",
icon:ShieldCheck
},

{
label:"Attendance",
href:"/admin/attendance",
icon:ClipboardList
},

{
label:"Payroll",
href:"/admin/payroll",
icon:Wallet
}

]

},

{

label:"CRM",

icon:UserCog,

children:[

{
label:"Companies",
href:"/admin/companies",
icon:Building2
},

{
label:"Contacts",
href:"/admin/contacts",
icon:Users
},

{
label:"Leads",
href:"/admin/leads",
icon:ClipboardList
},

{
label:"Pipeline",
href:"/admin/pipeline",
icon:BarChart3
}

]

},

{

label:"Marketing",

icon:Megaphone,

children:[

{
label:"Campaigns",
href:"/admin/campaigns",
icon:Megaphone
},

{
label:"Email Center",
href:"/admin/email-center",
icon:Mail
}

]

},

{

label:"Support",

icon:Ticket,

children:[

{
label:"Tickets",
href:"/admin/tickets",
icon:Ticket
},

{
label:"Knowledge Base",
href:"/admin/knowledge",
icon:BookOpen
}

]

},

{

label:"AI",

icon:Brain,

children:[

{
label:"AI Dashboard",
href:"/admin/ai",
icon:Brain
},

{
label:"AI Workers",
href:"/admin/ai-workers",
icon:Cpu
}

]

},

{

label:"Monitoring",

icon:Activity,

children:[

{
label:"Logs",
href:"/admin/logs",
icon:FileText
},

{
label:"Servers",
href:"/admin/servers",
icon:Server
},

{
label:"Monitoring",
href:"/admin/monitoring",
icon:Activity
}

]

},

{

label:"Infrastructure",

icon:HardDrive,

children:[

{
label:"Storage",
href:"/admin/storage",
icon:HardDrive
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
},

{
label:"Integrations",
href:"/admin/integrations",
icon:Boxes
}

]

},

{

label:"Analytics",

href:"/admin/analytics",

icon:BarChart3

},

{

label:"Database",

href:"/admin/database",

icon:Database

},

{

label:"Notifications",

href:"/admin/notifications",

icon:Bell,

badge:"12"

},

{

label:"Settings",

href:"/admin/settings",

icon:Settings

}

]





export default function AdminSidebar(){

const pathname=
usePathname()

const [search,setSearch]=
useState("")

const [expanded,setExpanded]=
useState<string[]>([
"Platform",
"Employees"
])

const filteredMenu=
useMemo(()=>{

if(!search){

return MENU

}

return MENU.filter(section=>{

if(
section.label
.toLowerCase()
.includes(
search.toLowerCase()
)
){

return true

}

return section.children?.some(child=>

child.label
.toLowerCase()
.includes(
search.toLowerCase()
)

)

})

},[search])



const toggle=(label:string)=>{

setExpanded(prev=>

prev.includes(label)

? prev.filter(x=>x!==label)

: [...prev,label]

)

}
return (

<aside
className="
w-[300px]
bg-white
border-r
flex
flex-col
h-screen
overflow-hidden
"
>

{/* Logo */}

<div
className="
h-20
border-b
px-6
flex
items-center
gap-4
shrink-0
"
>

<Image
src="/logo.png"
alt="KoniqTech"
width={42}
height={42}
/>

<div>

<h1
className="
text-xl
font-bold
leading-none
"
>

KoniqTech

</h1>

<p
className="
text-xs
text-slate-500
mt-1
"
>

Platform Administration

</p>

</div>

</div>





{/* Company Card */}

<div
className="
px-5
pt-5
"
>

<div
className="
rounded-2xl
border
bg-gradient-to-r
from-orange-500
to-orange-600
text-white
p-5
"
>

<p
className="
text-xs
uppercase
tracking-widest
opacity-80
"
>

Workspace

</p>

<h2
className="
font-semibold
text-lg
mt-2
"
>

KoniqTech

</h2>

<p
className="
text-sm
opacity-90
mt-1
"
>

Enterprise Plan

</p>

</div>

</div>





{/* Search */}

<div
className="
px-5
py-5
"
>

<div className="relative">

<Search

size={18}

className="
absolute
left-4
top-3.5
text-slate-400
"

/>

<input

value={search}

onChange={e=>
setSearch(
e.target.value
)
}

placeholder="Search menu..."

className="
w-full
h-11
rounded-xl
border
bg-slate-50
pl-11
pr-4
outline-none
focus:ring-2
focus:ring-orange-500
"

/>

</div>

</div>





{/* Navigation */}

<div
className="
flex-1
overflow-y-auto
px-3
pb-4
space-y-2
"
>

{

filteredMenu.map(item=>{

const Icon=item.icon

const hasChildren=
!!item.children

const active =
  item.href
    ? pathname === item.href
    : (
        item.children?.some((child) => {
          if (!child.href) return false

          return pathname.startsWith(child.href)
        }) ?? false
      )

const opened=
expanded.includes(
item.label
)

return(

<div
key={item.label}
className="space-y-1"
>

{

hasChildren

?

(

<button

onClick={()=>
toggle(
item.label
)
}

className={clsx(

"w-full",
"h-11",
"px-4",
"rounded-xl",
"flex",
"items-center",
"justify-between",
"transition",

active

?

"bg-orange-50 text-orange-600"

:

"hover:bg-slate-100"

)}

>

<div
className="
flex
items-center
gap-4
"
>

<Icon
size={18}
/>

<span>

{item.label}

</span>

</div>

{

opened

?

<ChevronDown
size={16}
/>

:

<ChevronRight
size={16}
/>

}

</button>

)

:

(

<Link

href={item.href!}

className={clsx(

"h-11",
"px-4",
"rounded-xl",
"flex",
"items-center",
"gap-4",
"transition",

active

?

"bg-orange-50 text-orange-600"

:

"hover:bg-slate-100"

)}

>

<Icon
size={18}
/>

<span>

{item.label}

</span>
          {item.badge && (

            <span
              className="
              ml-auto
              px-2
              py-0.5
              rounded-full
              text-[10px]
              font-semibold
              bg-red-500
              text-white
              "
            >
              {item.badge}
            </span>

          )}

        </Link>

      )

      }

      {

      hasChildren && opened && (

        <div
          className="
          ml-6
          mt-1
          space-y-1
          border-l
          border-slate-200
          pl-4
          "
        >

          {

          item.children!.map(child=>{

            const ChildIcon=child.icon

            const childActive=
            pathname===child.href

            return(

              <Link

                key={child.href}

                href={child.href!}

                className={clsx(

                  "h-10",
                  "rounded-lg",
                  "px-3",
                  "flex",
                  "items-center",
                  "gap-3",
                  "text-sm",
                  "transition",

                  childActive

                  ?

                  "bg-orange-100 text-orange-700 font-medium"

                  :

                  "text-slate-600 hover:bg-slate-100"

                )}

              >

                <ChildIcon
                  size={16}
                />

                <span>

                  {child.label}

                </span>

                {

                child.badge && (

                  <span
                    className="
                    ml-auto
                    rounded-full
                    bg-orange-600
                    text-white
                    text-[10px]
                    px-2
                    py-0.5
                    "
                  >

                    {child.badge}

                  </span>

                )

                }

              </Link>

            )

          })

          }

        </div>

      )

      }

    </div>

)

})

}

</div>

<SidebarFooter/>

</aside>
)

}