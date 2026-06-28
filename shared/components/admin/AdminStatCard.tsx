"use client"

import { ReactNode } from "react"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import clsx from "clsx"

interface AdminStatCardProps {

  title: string

  value: string | number

  icon: ReactNode

  description?: string

  change?: number

  footer?: ReactNode

  loading?: boolean

  color?:
    | "orange"
    | "green"
    | "blue"
    | "red"
    | "purple"

  onClick?: () => void

}

const COLORS = {

  orange: {
    bg: "bg-orange-50",
    icon: "text-orange-600",
    border: "border-orange-200"
  },

  green: {
    bg: "bg-green-50",
    icon: "text-green-600",
    border: "border-green-200"
  },

  blue: {
    bg: "bg-blue-50",
    icon: "text-blue-600",
    border: "border-blue-200"
  },

  red: {
    bg: "bg-red-50",
    icon: "text-red-600",
    border: "border-red-200"
  },

  purple: {
    bg: "bg-purple-50",
    icon: "text-purple-600",
    border: "border-purple-200"
  }

}

export default function AdminStatCard({

  title,

  value,

  icon,

  description,

  change,

  footer,

  loading,

  color="orange",

  onClick

}:AdminStatCardProps){

const theme =
COLORS[color]

return(

<div

onClick={onClick}

className={clsx(

"bg-white",
"rounded-3xl",
"border",
"p-6",
"transition-all",
"duration-200",

theme.border,

onClick &&
"cursor-pointer hover:shadow-xl hover:-translate-y-1"

)}

>

<div
className="
flex
items-start
justify-between
"
>

<div>

<p
className="
text-sm
font-medium
text-slate-500
"
>

{title}

</p>

{

loading

?

(

<div
className="
mt-4
h-10
w-32
rounded-lg
animate-pulse
bg-slate-200
"
/>

)

:

(

<h2
className="
mt-3
text-4xl
font-bold
tracking-tight
"
>

{value}

</h2>

)

}

{

description && (

<p
className="
mt-2
text-sm
text-slate-500
"
>

{description}

</p>

)

}

</div>

<div

className={clsx(

"w-14",
"h-14",
"rounded-2xl",
"flex",
"items-center",
"justify-center",

theme.bg,

theme.icon

)}

>

{icon}

</div>

</div>

{

change!==undefined && (

<div
className="
mt-5
flex
items-center
gap-2
"
>

{

change>=0

?

<ArrowUpRight
size={18}
className="text-green-600"
/>

:

<ArrowDownRight
size={18}
className="text-red-600"
/>

}

<span

className={clsx(

"text-sm",
"font-semibold",

change>=0

?

"text-green-600"

:

"text-red-600"

)}

>

{Math.abs(change)}%

</span>

<span
className="
text-sm
text-slate-500
"
>

vs last month

</span>

</div>

)}

{

footer && (

<div
className="
mt-6
pt-5
border-t
"
>

{footer}

</div>

)}

</div>

)

}