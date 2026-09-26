"use client";

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
  User,
  MapPin
} from "lucide-react"

import { getMenuForPlan } from "@/shared/lib/get-menu";
import { SubscriptionPlan } from "@prisma/client";
import {
  canView,
  type Permission,
} from "@/shared/lib/permissions";

type AppLocation = {
  id: string
  name: string
  city: string
  state: string | null
  country: string | null
  isDefault: boolean
}

export default function AppLayout({
  children,
  locations = [],
}: {
  children: React.ReactNode
  locations?: AppLocation[]
}) {




const [role,setRole] = useState("")

const [permissions, setPermissions] =
  useState<Permission[]>([])



const [subscriptionPlan, setSubscriptionPlan] =
  useState<SubscriptionPlan>(SubscriptionPlan.starter);
const [industry, setIndustry] = useState("")

const menu = getMenuForPlan(subscriptionPlan);

const pathname=
usePathname()

const [settingsOpen,setSettingsOpen]=
useState(
    pathname.startsWith("/settings")
)
useEffect(() => {
    setSettingsOpen(
        pathname.startsWith("/settings")
    )
}, [pathname])

const router = useRouter()

const [email,setEmail]=
useState("")

const [name,setName]=
useState("User")

const [activeLocationId, setActiveLocationId] =
  useState("")

const [locationOpen, setLocationOpen] =
  useState(false)

const [open,setOpen]=
useState(false)

const [notifications,setNotifications] =
  useState<any[]>([])

const [notificationsOpen,setNotificationsOpen] =
  useState(false)

const [userOpen,setUserOpen] =
  useState(false)

const ref=
useRef<HTMLDivElement>(null)



const sidebarRef = useRef<HTMLDivElement>(null)
const headerRef = useRef<HTMLDivElement>(null)

async function loadNotifications() {


  try {
    

    
    const res =
      await fetch("/api/notifications")

    const data =
      await res.json()

    setNotifications(data)

  } catch (error) {

    console.error(error)

  }

}

useEffect(() => {

  load()

  loadNotifications()

useEffect(() => {
  if (!locations.length) {
    setActiveLocationId("")
    return
  }

  const savedLocationId =
    window.localStorage.getItem("koniqtech_active_location")

  const savedLocationExists =
    savedLocationId &&
    locations.some(
      (location) => location.id === savedLocationId
    )

  if (savedLocationExists) {
    setActiveLocationId(savedLocationId)
    return
  }

  const defaultLocation =
    locations.find(
      (location) => location.isDefault
    ) || locations[0]

  if (defaultLocation) {
    setActiveLocationId(defaultLocation.id)

    window.localStorage.setItem(
      "koniqtech_active_location",
      defaultLocation.id
    )
  }
}, [locations])


  const interval =
    setInterval(
      loadNotifications,
      30000
    )

  document.addEventListener(
    "mousedown",
    outside
  )

  return () => {

    clearInterval(interval)

    document.removeEventListener(
      "mousedown",
      outside
    )

  }

}, [])

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
  (
    (session?.user as any)?.organizationRole ??
    (session?.user as any)?.employeeRole ??
    "owner"
  ).toLowerCase()
)



try {
  const res = await fetch("/api/me/permissions");

  if (res.ok) {
    const data = await res.json();
    console.log("Permissions:", data);
    setPermissions(data);
  } else {
    setPermissions([]);
  }
} catch {
  setPermissions([]);
}

setSubscriptionPlan(
  (session?.user as any)?.subscriptionPlan ?? "starter"
)

setIndustry(
  (session?.user as any)?.industry ?? ""
)



}


function selectLocation(locationId: string) {
  setActiveLocationId(locationId)

  window.localStorage.setItem(
    "koniqtech_active_location",
    locationId
  )

  document.cookie =
    `koniqtech_active_location=${encodeURIComponent(locationId)}; path=/; max-age=31536000; SameSite=Lax`

  setLocationOpen(false)

  window.dispatchEvent(
    new CustomEvent("koniqtech-location-changed", {
      detail: {
        locationId,
      },
    })
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


{locations.length > 0 && (
  <div className="px-4 pt-4 pb-2">
    <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-2 px-1">
      Location
    </div>

    <div className="relative">
      <button
        type="button"
        onClick={() =>
          setLocationOpen(!locationOpen)
        }
        className="
          w-full
          min-h-[52px]
          px-3
          rounded-xl
          border
          bg-white
          hover:bg-orange-50
          hover:border-orange-200
          flex
          items-center
          justify-between
          gap-3
          transition
        "
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="
              w-9
              h-9
              rounded-lg
              bg-orange-50
              text-orange-600
              flex
              items-center
              justify-center
              shrink-0
            "
          >
            <MapPin size={17} />
          </div>

          <div className="text-left min-w-0">
            <div className="text-sm font-medium text-slate-900 truncate">
              {
                locations.find(
                  (location) =>
                    location.id === activeLocationId
                )?.name || "Select location"
              }
            </div>

            <div className="text-xs text-slate-500 truncate">
              {
                locations.find(
                  (location) =>
                    location.id === activeLocationId
                )?.city || ""
              }
            </div>
          </div>
        </div>

        <ChevronDown
          size={16}
          className={`shrink-0 transition ${
            locationOpen
              ? "rotate-180"
              : ""
          }`}
        />
      </button>

      {locationOpen && (
        <div
          className="
            absolute
            left-0
            right-0
            top-[58px]
            bg-white
            border
            rounded-2xl
            shadow-xl
            overflow-hidden
            z-[100]
          "
        >
          <div className="px-4 py-3 border-b">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Your Locations
            </p>
          </div>

          <div className="max-h-[280px] overflow-y-auto p-2">
            {locations.map((location) => {
              const active =
                location.id === activeLocationId

              return (
                <button
                  key={location.id}
                  type="button"
                  onClick={() =>
                    selectLocation(location.id)
                  }
                  className={`
                    w-full
                    flex
                    items-center
                    gap-3
                    px-3
                    py-3
                    rounded-xl
                    text-left
                    transition
                    ${
                      active
                        ? "bg-orange-50 text-orange-600"
                        : "hover:bg-slate-50 text-slate-700"
                    }
                  `}
                >
                  <div
                    className={`
                      w-8
                      h-8
                      rounded-lg
                      flex
                      items-center
                      justify-center
                      shrink-0
                      ${
                        active
                          ? "bg-orange-100 text-orange-600"
                          : "bg-slate-100 text-slate-500"
                      }
                    `}
                  >
                    <MapPin size={15} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">
                      {location.name}
                    </div>

                    <div className="text-xs text-slate-500 truncate">
                      {location.city}
                      {location.state
                        ? `, ${location.state}`
                        : ""}
                    </div>
                  </div>

                  {active && (
                    <span className="text-xs font-semibold">
                      ✓
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  </div>
)}


<div
  className="
  flex-1
  overflow-y-auto
  px-3
  py-5
  "
>

  {menu.map(section=>(

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
   .filter((item) => {
    
  const planOk =
  !item.plans ||
  item.plans.includes(subscriptionPlan)

const industryOk =
  !item.industries ||
  item.industries.includes(industry as any)





const isOwner = role === "owner";

const permissionOk =
  !item.permission ||
  canView(
    permissions,
    item.permission,
    isOwner
  );

return (
  planOk &&
  industryOk &&
  permissionOk
)
})
    .map(item => {

      const Icon = item.icon

      if (item.children) {

        return (

          <div key={item.href}>

            <button
              onClick={() =>
                setSettingsOpen(
                  !settingsOpen
                )
              }
              className={`
              w-full
              h-11
              px-4
              rounded-xl
              flex
              items-center
              justify-between

              ${
                pathname.startsWith("/settings")
                  ? "bg-orange-50 text-orange-600 font-medium"
                  : "hover:bg-orange-50 text-slate-700"
              }
              `}
            >

              <div
  ref={sidebarRef}
  className="flex items-center gap-4"
>

                <Icon size={18} />

                {item.label}

              </div>

              <ChevronDown
                size={16}
                className={`transition ${
                  settingsOpen
                    ? "rotate-180"
                    : ""
                }`}
              />

            </button>

            {settingsOpen && (

              <div className="ml-8 mt-2 space-y-1">

          {item.children
  .filter((child) => {
    

    const planOk =
    !child.plans ||
    child.plans.includes(subscriptionPlan);

  const industryOk =
    !child.industries ||
    child.industries.includes(industry as any);
const isOwner = role === "owner";
 
const permissionOk =
  !child.permission ||
  canView(
    permissions,
    child.permission,
    isOwner
  );

return (
  planOk &&
  industryOk &&
  permissionOk
);

  }).map((child) => {

  const ChildIcon = child.icon

  return (

    <Link
      key={child.href}
      href={child.href}
      className={`
      flex
      items-center
      gap-3
      px-4
      py-2
      rounded-lg
      text-sm
      ${
        pathname === child.href
          ? "bg-orange-100 text-orange-600"
          : "hover:bg-slate-100 text-slate-700"
      }
      `}
    >

      <ChildIcon size={16} />

      <span>{child.label}</span>

    </Link>

  )

})}

              </div>

            )}

          </div>

        )

      }

      return (

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

          ${
            pathname === item.href
              ? "bg-orange-50 text-orange-600 font-medium"
              : "hover:bg-orange-50 text-slate-700"
          }
          `}
        >

          <Icon size={18} />

          {item.label}

        </Link>

      )

    })}

</div>

    </div>

  ))}

</div>



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

    

  </div>

  <div
  ref={headerRef}
  className="flex items-center gap-4"
>

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

    {notifications.length > 0 && (

      <span
        className="
        absolute
        -top-1
        -right-1
        min-w-[20px]
        h-5
        px-1
        rounded-full
        bg-red-500
        text-white
        text-[10px]
        flex
        items-center
        justify-center
        "
      >
        {notifications.length}
      </span>

    )}

  </button>

  {notificationsOpen && (

    <div
      className="
      absolute
      right-0
      top-14
      w-[360px]
      bg-white
      border
      rounded-3xl
      shadow-xl
      overflow-hidden
      z-50
      "
    >

      <div
        className="
        flex
        items-center
        justify-between
        p-5
        border-b
        "
      >

        <h3 className="font-semibold">

          Notifications

        </h3>

        <span
          className="
          text-xs
          px-2
          py-1
          rounded-full
          bg-orange-100
          text-orange-600
          "
        >
          {notifications.length}
        </span>

      </div>

      {notifications.length === 0 ? (

        <div
          className="
          p-8
          text-center
          text-slate-500
          "
        >
          No notifications
        </div>

      ) : (

        <div className="max-h-[420px] overflow-y-auto">

          {notifications.map((n:any)=>(

            <Link
              key={n.id}
              href="/notifications"
              className="
              block
              p-4
              border-b
              hover:bg-slate-50
              "
            >

              <div
                className="
                font-medium
                text-slate-900
                "
              >
                {n.title}
              </div>

              <div
                className="
                text-sm
                text-slate-500
                mt-1
                "
              >
                {n.message}
              </div>

              <div
                className="
                text-xs
                text-slate-400
                mt-2
                "
              >
                {new Date(
                  n.createdAt
                ).toLocaleString()}
              </div>

            </Link>

          ))}

        </div>

      )}

      <Link
        href="/notifications"
        className="
        block
        p-4
        text-center
        text-orange-600
        font-medium
        border-t
        hover:bg-orange-50
        "
      >
        View All Notifications
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

function outside(e:any){

  if(
    ref.current &&
    !ref.current.contains(e.target)
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