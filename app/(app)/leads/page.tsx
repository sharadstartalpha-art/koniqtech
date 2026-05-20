"use client"

import { useEffect,useState } from "react"

export default function LeadsPage(){

const [leads,setLeads]=useState([])
const [name,setName]=useState("")
const [email,setEmail]=useState("")

async function load(){

const r=await fetch("/api/leads")
const d=await r.json()

setLeads(d)

}

useEffect(()=>{

load()

},[])

async function createLead(){

await fetch(

"/api/leads",

{
method:"POST",

headers:{
"Content-Type":
"application/json"
},

body:JSON.stringify({

name,
email

})

}

)

setName("")
setEmail("")

load()

}

return(

<div className="space-y-8">

<div className="flex justify-between">

<h1 className="text-4xl font-bold text-slate-900">

Leads

</h1>

<button
onClick={createLead}
className="bg-blue-600 text-white px-4 py-2 text-sm rounded-xl">

Add Lead

</button>

</div>

<div className="bg-white p-8 rounded-3xl shadow">

<div className="grid grid-cols-2 gap-4">

<input
value={name}
onChange={(e)=>setName(e.target.value)}
placeholder="Lead Name"
className="border p-4 rounded-xl text-slate-900"
/>

<input
value={email}
onChange={(e)=>setEmail(e.target.value)}
placeholder="Email"
className="border p-4 rounded-xl text-slate-900"
/>

</div>

</div>

<div className="bg-white rounded-3xl shadow">

<table className="w-full">

<thead>

<tr className="border-b">

<th className="p-5 text-left text-slate-700">

Name

</th>

<th className="text-left text-slate-700">

Email

</th>

</tr>

</thead>

<tbody>

{

leads.map((x:any)=>(

<tr key={x.id}>

<td className="p-5">

{x.name}

</td>

<td>

{x.email}

</td>

</tr>

))

}

</tbody>

</table>

</div>

</div>

)

}