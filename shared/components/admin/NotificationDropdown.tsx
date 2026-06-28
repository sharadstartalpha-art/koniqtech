"use client"

import {
    useEffect,
    useRef,
    useState
} from "react"

import Link from "next/link"

import {

    Bell,
    CheckCheck,
    Loader2,
    AlertCircle

} from "lucide-react"

export interface AdminNotification{

    id:string

    title:string

    message:string

    read:boolean

    createdAt:string

    href?:string

}

interface Props{

    open:boolean

    setOpen:(open:boolean)=>void

}

export default function NotificationDropdown({

open,

setOpen

}:Props){

const ref=
useRef<HTMLDivElement>(null)

const [loading,setLoading]=
useState(false)

const [notifications,setNotifications]=
useState<AdminNotification[]>([])

const [error,setError]=
useState("")

const unread=

notifications.filter(
x=>!x.read
).length

async function loadNotifications(){

try{

setLoading(true)

setError("")

const res=
await fetch(
"/api/admin/notifications",
{
cache:"no-store"
}
)

if(!res.ok){

throw new Error(
"Unable to load notifications"
)

}

const data=
await res.json()

setNotifications(data)

}catch(e){

setError(
"Failed to load notifications"
)

}finally{

setLoading(false)

}

}

useEffect(()=>{

if(open){

loadNotifications()

}

},[open])

useEffect(()=>{

function outside(
e:MouseEvent
){

if(

ref.current &&

!ref.current.contains(
e.target as Node
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

async function markAllRead(){

try{

await fetch(

"/api/admin/notifications/read-all",

{

method:"POST"

}

)

setNotifications(prev=>

prev.map(x=>({

...x,

read:true

}))

)

}catch{}

}

if(!open){

return null

}

return(

<div

ref={ref}

className="
absolute
right-0
top-14
w-[390px]
bg-white
border
rounded-3xl
shadow-2xl
overflow-hidden
z-[100]
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

<div>

<h3
className="
font-semibold
text-lg
"
>

Notifications

</h3>

<p
className="
text-sm
text-slate-500
mt-1
"
>

{unread} unread notifications

</p>

</div>

<button

onClick={markAllRead}

className="
flex
items-center
gap-2
text-sm
text-orange-600
hover:text-orange-700
"

>

<CheckCheck
size={16}
/>

Mark all read

</button>

</div>
{

loading && (

<div
className="
p-10
flex
justify-center
items-center
"
>

<Loader2
size={26}
className="animate-spin text-orange-600"
/>

</div>

)

}

{

!loading && error && (

<div
className="
p-8
flex
flex-col
items-center
justify-center
text-center
"
>

<AlertCircle
size={34}
className="text-red-500"
/>

<p
className="
mt-4
text-sm
text-slate-500
"
>

{error}

</p>

</div>

)

}

{

!loading &&

!error &&

notifications.length===0 && (

<div
className="
p-10
text-center
"
>

<div
className="
w-16
h-16
rounded-full
bg-orange-100
mx-auto
flex
items-center
justify-center
"
>

<Bell
size={28}
className="text-orange-600"
/>

</div>

<h3
className="
mt-5
font-semibold
"
>

No Notifications

</h3>

<p
className="
mt-2
text-sm
text-slate-500
"
>

Everything looks good.

</p>

</div>

)

}

{

!loading &&

!error &&

notifications.length>0 && (

<div
className="
max-h-[420px]
overflow-y-auto
"
>

{

notifications.map(item=>(

<Link

key={item.id}

href={
item.href ||

"/admin/notifications"
}

onClick={()=>
setOpen(false)
}

className={`
block
p-5
border-b
transition

${

item.read

?

"bg-white hover:bg-slate-50"

:

"bg-orange-50 hover:bg-orange-100"

}

`}

>

<div
className="
flex
items-start
justify-between
gap-3
"
>

<div>

<h4
className="
font-semibold
text-slate-900
"
>

{item.title}

</h4>

<p
className="
mt-1
text-sm
text-slate-500
line-clamp-2
"
>

{item.message}

</p>

<p
className="
mt-3
text-xs
text-slate-400
"
>

{

new Date(
item.createdAt
).toLocaleString()

}

</p>

</div>

{

!item.read && (

<div
className="
w-3
h-3
rounded-full
bg-orange-500
mt-2
shrink-0
"
/>

)

}

</div>

</Link>

))

}

</div>

)

}

<div
className="
border-t
bg-slate-50
"
>

<Link

href="/admin/notifications"

onClick={()=>
setOpen(false)
}

className="
h-14
flex
items-center
justify-center
font-medium
text-orange-600
hover:bg-orange-50
"

>

View All Notifications

</Link>

</div>

</div>

)

}