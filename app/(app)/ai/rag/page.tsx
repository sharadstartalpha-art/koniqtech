"use client"

import { useState } from "react"

export default function Page(){

const [query,setQuery]=

useState("")

return(

<div>

<h1 className="text-5xl font-bold mb-8">

AI Knowledge Search

</h1>

<div className="bg-white rounded-3xl p-10">

<input

value={query}

onChange={e=>

setQuery(

e.target.value

)

}

placeholder="Ask knowledge base"

className="w-full border p-5 rounded-xl mb-8"

/>

<div className="bg-slate-100 rounded-3xl p-10 min-h-[300px]">

Results

</div>

</div>

</div>

)

}