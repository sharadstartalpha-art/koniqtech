"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"



export default function DataTable({

title,
buttonLabel,
buttonHref,
columns,
rows,
onDeletePath,
editPath,
rowHref
}:any){

const router = useRouter()

const [search,setSearch]=useState("")

const filtered=

(rows || []).filter(

(r:any)=>

JSON.stringify(r)

.toLowerCase()

.includes(

search.toLowerCase()

)

)

async function remove(id:string){

if(

!confirm(

"Delete item?"

)

){

return

}

await fetch(

`${onDeletePath}/${id}`,

{

method:"DELETE"

}

)

window.location.reload()

}

return(

<div className="space-y-6">

<div className="
flex
items-center
justify-between
">

<h1 className="
text-[44px]

font-semibold

tracking-[-1px]

text-black
">

{title}

</h1>

{buttonHref && (

<Link
href={buttonHref}
className="
h-11
px-5
bg-green-600
hover:bg-green-700
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

)}

</div>

<div className="
bg-white

border

rounded-3xl

overflow-hidden
">

<div className="
h-16

px-6

border-b

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
h-10

w-[320px]

bg-[#f5f5f5]

border

rounded-xl

px-4

text-sm

outline-none
"

/>

<div className="
text-sm
text-slate-500
">

Page 1

</div>

</div>

<table className="w-full">

<thead>

<tr className="
bg-[#fafafa]

border-b

text-sm
">

<th className="px-6 h-11">

SL

</th>

{

(columns || []).map(

(c:any)=>(

<th

key={c.key}

className="
px-6
h-11

text-left

font-medium
"

>

{c.label}

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

(row:any,index:number)=>(

<tr
  key={row.id}
  onClick={()=>{
    if(rowHref){
      router.push(
        `${rowHref}/${row.id}`
      )
    }
  }}
  className={`
    border-b
    hover:bg-[#fafafa]
    text-sm
    ${rowHref ? "cursor-pointer" : ""}
  `}
>

<td className="
px-6
h-14
">

{index+1}

</td>

{

(columns || []).map(

(c:any)=>(

<td

key={c.key}

className="
px-6
"

>

{row[c.key]}

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
{editPath && (
<Link

href={`${editPath}/${row.id}`}
onClick={(e)=>e.stopPropagation()}

className="
px-3

h-8

bg-slate-100

rounded-lg

text-xs

flex
items-center
"

>

Edit

</Link>
)}

{onDeletePath && (
<button

onClick={(e)=>{
    e.stopPropagation()
    remove(row.id)
  }}

className="
px-3

h-8

bg-red-50

text-red-600

rounded-lg

text-xs
"

>

Delete

</button>
)}
</div>

</td>

</tr>

)

)

}

</tbody>

</table>

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

{filtered.length}

items

</div>

</div>

</div>

</div>

)

}