"use client"

import { useState } from "react"

export default function Page(){

const [phone,setPhone]=useState("")
const [message,setMessage]=useState("")

async function send(){

await fetch("/api/twilio",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

phone,
message

})

})

}

return(

<div className="space-y-6">

<h1 className="text-5xl font-bold">

Twilio SMS

</h1>

<input
className="border p-4 w-full"
placeholder="Phone"
onChange={e=>setPhone(e.target.value)}
/>

<textarea
className="border p-4 w-full"
onChange={e=>setMessage(e.target.value)}
/>

<button
onClick={send}
className="bg-black text-white px-6 py-3 rounded-xl"
>

Send

</button>

</div>

)

}