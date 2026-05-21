"use client"

import { useState } from "react"

export default function Page(){

const [form,setForm]=useState({

name:"",
phone:"",
email:"",
address:"",
service:"",
notes:""

})

return(

<div className="space-y-8">

<h1 className="text-5xl font-bold">

Create Lead

</h1>

<div className="bg-white rounded-3xl p-10 space-y-5">

<input
placeholder="Customer name"
className="w-full border p-5 rounded-xl"
onChange={e=>
setForm({
...form,
name:e.target.value
})
}
/>

<input
placeholder="Phone"
className="w-full border p-5 rounded-xl"
/>

<input
placeholder="Email"
className="w-full border p-5 rounded-xl"
/>

<input
placeholder="Address"
className="w-full border p-5 rounded-xl"
/>

<select className="w-full border p-5 rounded-xl">

<option>

Roof Repair

</option>

<option>

Replacement

</option>

</select>

<textarea
className="w-full border p-5 rounded-xl h-40"
/>

<button className="bg-blue-600 text-white px-8 py-4 rounded-xl">

Save Lead

</button>

</div>

</div>

)

}