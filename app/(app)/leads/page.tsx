"use client"

import {useEffect,useState} from "react"

export default function Leads(){

const [items,setItems]=useState([])

const [name,setName]=useState("")
const [email,setEmail]=useState("")

async function load(){

const r=await fetch("/api/leads")

setItems(

await r.json()

)

}

useEffect(()=>{

load()

},[])

async function addLead(){

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

load()

setName("")
setEmail("")

}

async function remove(id:string){

await fetch(

`/api/leads/${id}`,

{

method:"DELETE"

}

)

load()

}

return(

<div className="space-y-6">

<div className="flex justify-between">

<h1 className="text-2xl font-semibold">

Leads

</h1>

<button
onClick={addLead}
className="bg-blue-600 text-white px-4 py-2 rounded-lg">

Create

</button>

</div>

<div className="bg-white p-6 rounded-xl grid grid-cols-2 gap-4">

<input
placeholder="Lead"

value={name}

onChange={(e)=>

setName(e.target.value)

}

className="border p-3 rounded-lg"
/>

<input
placeholder="Email"

value={email}

onChange={(e)=>

setEmail(e.target.value)

}

className="border p-3 rounded-lg"
/>

</div>

<div className="bg-white rounded-xl">

<table className="w-full">

<tbody>

{

items.map((x:any)=>(

<tr key={x.id}>

<td className="p-4">

{x.name}

</td>

<td>

{x.email}

</td>

<td>

<button
onClick={()=>

remove(x.id)

}

className="text-red-600">

Delete

</button>

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