"use client"

import { useState } from "react"

export default function Page(){

const [name,setName]=
useState("Koniq Admin")

const [email,setEmail]=
useState("admin@company.com")

return(

<div className="max-w-4xl">

<h1 className="text-5xl font-bold mb-8">

Profile Settings

</h1>

<div className="bg-white rounded-3xl p-10 space-y-6">

<input

value={name}

onChange={e=>
setName(
e.target.value
)
}

className="w-full border p-5 rounded-xl"

/>

<input

value={email}

onChange={e=>
setEmail(
e.target.value
)
}

className="w-full border p-5 rounded-xl"

/>

<input
type="file"
/>

<button className="bg-blue-600 text-white px-8 py-4 rounded-xl">

Save Profile

</button>

</div>

</div>

)

}