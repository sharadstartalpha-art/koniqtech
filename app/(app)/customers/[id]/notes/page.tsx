"use client"

import { useState } from "react"

export default function Page(){

const [note,setNote]=useState("")

return(

<div className="space-y-8">

<h1 className="text-5xl font-bold">

Customer Notes

</h1>

<div className="bg-white rounded-3xl p-8">

<textarea

value={note}

onChange={e=>

setNote(

e.target.value

)

}

className="w-full border rounded-xl p-5 h-52"

/>

<button className="mt-5 bg-blue-600 text-white px-8 py-4 rounded-xl">

Save Note

</button>

</div>

</div>

)

}