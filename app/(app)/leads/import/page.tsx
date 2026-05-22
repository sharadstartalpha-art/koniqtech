"use client"

import { useState } from "react"

export default function Page(){

const [file,setFile]=useState<File|null>(null)

async function upload(){

if(!file){

alert("Select CSV")

return

}

const form=

new FormData()

form.append(
"file",
file
)

await fetch(

"/api/leads/import",

{

method:"POST",

body:form

}

)

alert(

"Import started"

)

}

return(

<div className="max-w-4xl mx-auto">

<div className="bg-white rounded-3xl p-10">

<h1 className="text-4xl font-bold mb-8">

Import Leads CSV

</h1>

<div className="border-2 border-dashed rounded-3xl p-20 text-center">

<input

type="file"

accept=".csv"

onChange={e=>

setFile(

e.target.files?.[0]||

null

)

}

/>

</div>

<button

onClick={upload}

className="mt-8 bg-blue-600 text-white px-8 py-4 rounded-xl"

>

Import

</button>

</div>

</div>

)

}