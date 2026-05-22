"use client"

import { useState } from "react"

export default function Page(){

const [files,setFiles]=

useState<File[]>([])

return(

<div>

<h1 className="text-5xl font-bold mb-8">

AI Training Center

</h1>

<div className="bg-white rounded-3xl p-10">

<input

multiple

type="file"

accept=".pdf,.csv,.docx"

onChange={e=>

setFiles(

Array.from(

e.target.files||

[]

)

)

}

/>

<div className="grid gap-4 mt-8">

{

files.map(

f=>(

<div
key={f.name}
className="bg-slate-100 p-5 rounded-xl"
>

{f.name}

</div>

)

)

}

</div>

<button className="mt-8 bg-blue-600 text-white px-8 py-4 rounded-xl">

Train AI

</button>

</div>

</div>

)

}