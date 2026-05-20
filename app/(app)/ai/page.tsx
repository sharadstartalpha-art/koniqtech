"use client"

import {useState} from "react"

export default function AI(){

const[q,setQ]=useState("")

return(

<div className="bg-white rounded-xl p-6">

<h1 className="text-2xl mb-6">

AI Assistant

</h1>

<textarea

value={q}

onChange={(e)=>

setQ(e.target.value)

}

className="border p-4 rounded w-full h-40"

/>

<button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">

Run

</button>

</div>

)

}