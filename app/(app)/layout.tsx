"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
useEffect,
useRef,
useState
} from "react"

import {
getSession,
signOut
} from "next-auth/react"

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
Search,
ChevronDown,
CheckSquare,
LogOut,
MoreHorizontal,
User

} from "lucide-react"

import { MENU } from "@/config/sidebar"



export default function Layout({

children

}:{

children:React.ReactNode

}){


const [role,setRole] =
useState("sales")

const pathname=
usePathname()



const router = useRouter()

const [email,setEmail]=
useState("")

const [name,setName]=
useState("User")

const [open,setOpen]=
useState(false)

const [notificationsOpen,setNotificationsOpen] =
useState(false)

const [userOpen,setUserOpen] =
  useState(false)

const ref=
useRef<HTMLDivElement>(null)

useEffect(()=>{

load()

document.addEventListener(
"mousedown",
outside
)

return()=>{

document.removeEventListener(
"mousedown",
outside
)

}

},[])

function outside(
e:any
){

if(

ref.current &&

!ref.current.contains(
e.target
)

){

setOpen(false)

}

}

async function load() {
  const session = await getSession()

  if (!session) {
    router.replace("/login")
    return
  }

  setEmail(
    session?.user?.email || ""
  )

  setName(
    (session?.user as any)?.name ||
    session?.user?.email?.split("@")[0] ||
    "User"
  )


setRole(
  (session?.user as any)?.role ||
  "sales"
)



}

return(

<div className="h-screen flex bg-[#f8f8f8]">

<aside className="
w-[280px]
bg-white
border-r
flex
flex-col
">

<div className="
h-20
px-8
border-b

flex
items-center
gap-4
">

<img
src="/logo.png"
className="w-10 h-10"
/>

<div>

<h1 className="text-xl font-semibold">

Koniqtech

</h1>

<p className="text-xs text-slate-500">
  Field Service Platform
</p>

</div>

</div>

<div
  className="
  flex-1
  overflow-y-auto
  px-3
  py-5
  "
>

  {MENU.map(section=>(

    <div
      key={section.title}
      className="mb-6"
    >

      <div
        className="
        px-4
        mb-2
        text-xs
        uppercase
        tracking-wider
        font-semibold
        text-slate-400
        "
      >
        {section.title}
      </div>

      <div className="space-y-1">

        {section.items

.filter(item =>
  item.roles.includes(role)
)

.map(item => {

  const Icon = item.icon

  return(

    <Link
      key={item.href}
      href={item.href}
      className={`
      h-11
      px-4
      rounded-xl
      flex
      items-center
      gap-4
      transition

      ${
        pathname===item.href
        ? "bg-orange-50 text-orange-600 font-medium"
        : "hover:bg-orange-50 text-slate-700"
      }
      `}
    >

      <Icon size={18}/>

      {item.label}

    </Link>

  )

})}

      </div>

    </div>

  ))}

</div>

<SidebarFooter

name={name}

email={email}

/>

</aside>

<div className="
flex-1
flex
flex-col
">

<header
className="
h-20
bg-white
border-b
px-8
flex
items-center
justify-between
"
>

  <div className="flex gap-2">

    <Link
      href="/leads/new"
      className="
      px-4
      py-2
      bg-orange-600
      text-white
      rounded-xl
      "
    >
      + Lead
    </Link>

    <Link
      href="/customers/create"
      className="
      px-4
      py-2
      border
      rounded-xl
      "
    >
      + Customer
    </Link>

    <Link
      href="/jobs/create"
      className="
      px-4
      py-2
      border
      rounded-xl
      "
    >
      + Job
    </Link>

    <Link
      href="/quotes/create"
      className="
      px-4
      py-2
      border
      rounded-xl
      "
    >
      + Quote
    </Link>

  </div>

  <div className="flex items-center gap-4">

    {/* Notification Bell */}


    {/* Notifications */}

<div className="relative">

  <button
    onClick={() =>
      setNotificationsOpen(
        !notificationsOpen
      )
    }
    className="
    relative
    w-11
    h-11
    rounded-2xl
    border
    bg-white
    hover:bg-orange-50
    flex
    items-center
    justify-center
    "
  >

    <Bell size={18}/>

    <span
      className="
      absolute
      -top-1
      -right-1
      w-5
      h-5
      rounded-full
      bg-red-500
      text-white
      text-[10px]
      flex
      items-center
      justify-center
      "
    >
      12
    </span>

  </button>

  {notificationsOpen && (

    <div
      className="
      absolute
      right-0
      top-14
      w-[340px]
      bg-white
      border
      rounded-3xl
      shadow-xl
      overflow-hidden
      z-50
      "
    >

      <div className="p-5 border-b">

        <h3 className="font-semibold">
          Notifications
        </h3>

      </div>

      <div className="divide-y">

        <Link
          href="/notifications"
          className="
          block
          p-4
          hover:bg-slate-50
          "
        >
          New Lead Assigned
        </Link>

        <Link
          href="/notifications"
          className="
          block
          p-4
          hover:bg-slate-50
          "
        >
          Quote Approved
        </Link>

        <Link
          href="/notifications"
          className="
          block
          p-4
          hover:bg-slate-50
          "
        >
          Invoice Paid
        </Link>

        <Link
          href="/notifications"
          className="
          block
          p-4
          hover:bg-slate-50
          "
        >
          Crew Checked In
        </Link>

      </div>

      <Link
        href="/notifications"
        className="
        block
        p-4
        text-center
        text-orange-600
        border-t
        "
      >
        View All
      </Link>

    </div>

  )}

</div>
    {/* User */}

<div className="relative">

  <button
    onClick={() =>
      setUserOpen(!userOpen)
    }
    className="
    flex
    items-center
    gap-3
    px-3
    py-2
    rounded-2xl
    hover:bg-orange-50
    "
  >

    <div
      className="
      w-10
      h-10
      rounded-full
      bg-green-600
      text-white
      flex
      items-center
      justify-center
      "
    >
      {name.charAt(0).toUpperCase()}
    </div>

    <div className="text-left">

      <div className="text-sm font-medium">
        {name}
      </div>

      <div className="text-xs text-slate-500">
        {email}
      </div>

    </div>

    <ChevronDown size={16}/>

  </button>

  {userOpen && (

    <div
      className="
      absolute
      right-0
      top-14
      w-[260px]
      bg-white
      border
      rounded-3xl
      shadow-xl
      overflow-hidden
      z-50
      "
    >

      <div className="p-5 border-b">

        <p className="font-semibold">
          {name}
        </p>

        <p className="text-sm text-slate-500">
          {email}
        </p>

      </div>

      <Link
        href="/profile"
        className="
        flex
        items-center
        gap-3
        p-4
        hover:bg-slate-50
        "
      >
        <User size={16}/>
        Profile
      </Link>

      <Link
        href="/tasks"
        className="
        flex
        items-center
        gap-3
        p-4
        hover:bg-slate-50
        "
      >
        <CheckSquare size={16}/>
        My Tasks
      </Link>

      <Link
        href="/notifications"
        className="
        flex
        items-center
        gap-3
        p-4
        hover:bg-slate-50
        "
      >
        <Bell size={16}/>
        Notifications
      </Link>

      <Link
        href="/settings"
        className="
        flex
        items-center
        gap-3
        p-4
        hover:bg-slate-50
        "
      >
        <Settings size={16}/>
        Settings
      </Link>

      <button
        onClick={async () => {

          await signOut({
            redirect:false
          })

          window.location.href =
            "/login"

        }}
        className="
        w-full
        flex
        items-center
        gap-3
        p-4
        text-red-600
        hover:bg-red-50
        "
      >
        <LogOut size={16}/>
        Logout
      </button>

    </div>

  )}

</div>



  </div>

</header>

<main className="
flex-1
overflow-auto
p-8
">

{children}

</main>

</div>

</div>

)

}

function SidebarFooter({

name,
email

}:{

name:string
email:string

}){

const [open,setOpen]=
useState(false)

const ref=
useRef<HTMLDivElement>(null)

useEffect(()=>{

function outside(
e:any
){

if(

ref.current &&

!ref.current.contains(
e.target
)

){

setOpen(false)

}

}

document.addEventListener(
"mousedown",
outside
)

return()=>{

document.removeEventListener(
"mousedown",
outside
)

}

},[])

return(

<div

ref={ref}

className="
border-t

relative

bg-white
"

>

<button

onClick={()=>
setOpen(
!open
)
}

className="
w-full

h-16

px-4

flex
items-center
justify-between

hover:bg-slate-50
"

>

<div className="
flex
items-center
gap-3
">

<div className="
w-8
h-8

rounded-full

bg-slate-200

flex
items-center
justify-center

text-sm
font-medium
">

{

name
?.charAt(0)
?.toUpperCase()

||

"K"

}

</div>

<p className="
text-sm

font-medium

truncate

max-w-[150px]
">

{

email ||

"No user"

}

</p>

</div>

<MoreHorizontal
size={18}
/>

</button>

{

open && (

<div className="
absolute

left-2
bottom-20

w-[220px]

bg-white

border

rounded-3xl

shadow-xl

overflow-hidden

z-50
">

<div className="
p-4
border-b
">

<p className="
font-medium
">

{name}

</p>

<p className="
text-sm
text-slate-500
truncate
">

{email}

</p>

</div>

<Link

href="/settings"

className="
p-4

flex
items-center
gap-3

hover:bg-slate-50
"

>

<Settings
size={16}
/>

Settings

</Link>

<button

onClick={async () => {
  await signOut({
    redirect: false,
  })

  window.location.replace("/login")
}}

className="
w-full

p-4

flex
items-center
gap-3

text-red-600

hover:bg-red-50
"

>

<LogOut
size={16}
/>

Logout

</button>

</div>

)

}

</div>

)

}