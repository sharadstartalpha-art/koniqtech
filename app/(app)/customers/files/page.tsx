"use client"

import { useState } from "react"

export default function Page(){

const [files,setFiles]=

useState<File[]>([])

return(

<div>

<h1 className="text-5xl font-bold mb-8">

Customer Files

</h1>

<div className="bg-white rounded-3xl p-10">

<input

multiple

type="file"

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

className="p-5 rounded-xl bg-slate-100"

>

{f.name}

</div>

)

)

}

</div>

</div>

</div>

)

}