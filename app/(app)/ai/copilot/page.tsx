"use client"

import {useState} from "react"

export default function AI(){

const[
msg,
setMsg
]=useState("")

return(

<div className="
bg-white
rounded-xl
p-8
">

<h1 className="
text-2xl
font-bold
mb-6
">

AI Copilot

</h1>

<textarea

value={msg}

onChange={e=>
setMsg(
e.target.value
)
}

className="
border
w-full
h-40
p-4
rounded-xl
"

/>

<button className="
mt-4
bg-blue-600
text-white
px-5
py-3
rounded-xl
">

Run

</button>

</div>

)

}