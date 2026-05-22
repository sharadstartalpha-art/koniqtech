"use client"

import { useState } from "react"

export default function Page(){

const [files,setFiles]=

useState<File[]>([])

return(

<div>

<h1 className="text-5xl font-bold mb-8">

Job Photos

</h1>

<div className="bg-white rounded-3xl p-10">

<input

multiple

type="file"

accept="image/*"

onChange={e=>

setFiles(

Array.from(

e.target.files||

[]

)

)

}

/>

<div className="grid grid-cols-4 gap-6 mt-8">

{

files.map(

f=>(

<div

key={f.name}

className="bg-slate-100 rounded-xl p-10"

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