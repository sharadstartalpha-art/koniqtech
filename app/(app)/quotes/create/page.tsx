"use client"

import { useState } from "react"

export default function Page(){

const [items,setItems]=useState([

{
name:"",
price:""
}

])

return(

<div className="space-y-8">

<h1 className="text-5xl font-bold">

Create Quote

</h1>

<div className="bg-white rounded-3xl p-10 space-y-5">

<input
placeholder="Customer"
className="w-full border p-5 rounded-xl"
/>

<input
placeholder="Property Address"
className="w-full border p-5 rounded-xl"
/>

{

items.map((x,i)=>(

<div
key={i}
className="grid grid-cols-2 gap-4"
>

<input
placeholder="Item"
className="border p-4 rounded-xl"
/>

<input
placeholder="Price"
className="border p-4 rounded-xl"
/>

</div>

))

}

<button

onClick={()=>

setItems([

...items,

{
name:"",
price:""
}

])

}

className="bg-slate-100 px-6 py-3 rounded-xl"

>

Add Item

</button>

<div className="pt-5">

<button className="bg-blue-600 text-white px-8 py-4 rounded-xl">

Create Quote

</button>

</div>

</div>

</div>

)

}