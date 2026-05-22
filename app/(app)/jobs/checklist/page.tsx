"use client"

import { useState } from "react"

export default function Page(){

const [items,setItems]=

useState([

"Inspection",

"Materials",

"Install",

"Photos",

"Completion"

])

return(

<div>

<h1 className="text-5xl font-bold mb-8">

Job Checklist

</h1>

<div className="bg-white rounded-3xl p-10 space-y-4">

{

items.map(

i=>(

<label

key={i}

className="flex gap-4"

>

<input
type="checkbox"
/>

{i}

</label>

)

)

}

</div>

</div>

)

}