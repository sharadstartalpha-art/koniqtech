"use client"

import {useState} from "react"

export default function Assistant(){

const[
msg,
setMsg
]=useState("")

return(

<div className="
space-y-6
">

<h1 className="
text-4xl
font-bold
">

AI Assistant

</h1>

<textarea
value={msg}
onChange={
e=>setMsg(
e.target.value
)
}
className="
border
w-full
h-40
rounded-xl
p-4
"
/>

<button className="
bg-black
text-white
px-6
py-3
rounded-xl
">

Ask AI

</button>

</div>

)

}