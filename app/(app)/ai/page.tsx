"use client"

import { useState } from "react"

export default function Page(){

const [prompt,setPrompt]=useState("")
const [answer,setAnswer]=useState("")

async function ask(){

const r=
await fetch("/api/openai",{

method:"POST",

body:JSON.stringify({

prompt

})

})

const data=
await r.json()

setAnswer(
data.message.content
)

}

return(

<div className="space-y-5">

<h1 className="text-5xl">

AI Assistant

</h1>

<textarea
className="border w-full p-5"
onChange={e=>setPrompt(e.target.value)}
/>

<button
onClick={ask}
>

Ask

</button>

<p>

{answer}

</p>

</div>

)

}