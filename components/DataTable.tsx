"use client"

import Link from "next/link"
import { useState } from "react"

type Column={

key:string
label:string

}

export default function DataTable({

title,
buttonLabel,
buttonHref,
columns,
rows

}:{

title:string

buttonLabel:string
buttonHref:string

columns:Column[]

rows:any[]

}){

const [search,setSearch]=useState("")

const filtered=

rows.filter(

row=>

JSON.stringify(row)

.toLowerCase()

.includes(

search.toLowerCase()

)

)

return(

<div className="space-y-6">

<div className="
flex
items-center
justify-between
">

<div>

<h1 className="
text-[54px]
font-semibold
tracking-[-2px]
text-black
">

{title}

</h1>

</div>

<Link

href={buttonHref}

className="
h-12
px-6

bg-black
text-white

rounded-2xl

text-sm
font-medium

flex
items-center
"

>

{buttonLabel}

</Link>

</div>

<div className="
bg-white

border
border-[#e5e7eb]

rounded-3xl

overflow-hidden
">

<div className="
h-16

border-b

px-6

flex
items-center
justify-between
">

<input

value={search}

onChange={e=>

setSearch(

e.target.value

)

}

placeholder="Search..."

className="

h-11

w-[380px]

rounded-2xl

bg-[#f5f5f5]

border

border-[#e7e7e7]

px-4

text-sm

outline-none

"

/>

<p className="
text-sm
text-slate-500
">

Page 1

</p>

</div>

<div className="overflow-x-auto">

<table className="
w-full
min-w-[900px]
">

<thead>

<tr className="
bg-[#fafafa]

text-sm

text-slate-500

border-b
">

{

columns.map(

col=>(

<th

key={col.key}

className="
px-6
h-12

font-medium

text-left
"

>

{col.label}

</th>

)

)

}

<th className="
px-6
text-left
">

Actions

</th>

</tr>

</thead>

<tbody>

{

filtered.map(

(row:any)=>(

<tr

key={row.id}

className="
border-b

hover:bg-[#fafafa]

text-sm
"

>

{

columns.map(

col=>(

<td

key={col.key}

className="
px-6
h-14
"

>

{

row[col.key]

}

</td>

)

)

}

<td className="
px-6
">

<div className="
flex
gap-2
">

<button className="
h-8
px-3

rounded-lg

bg-slate-100

text-xs
">

Edit

</button>

<button className="
h-8
px-3

rounded-lg

bg-red-50

text-red-600

text-xs
">

Delete

</button>

</div>

</td>

</tr>

)

)

}

</tbody>

</table>

</div>

<div className="
h-14

px-6

flex
items-center
justify-between

text-sm

text-slate-500
">

<div>

Page 1 of 1

</div>

<div>

{filtered.length} items

</div>

</div>

</div>

</div>

)

}