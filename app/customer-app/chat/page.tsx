"use client"

import {useState} from "react"

export default function Chat(){

const[
msg,
setMsg
]=useState("")

return(

<div className="
max-w-lg
mx-auto
bg-white
p-8
rounded-xl
">

<textarea

value={msg}

onChange={e=>
setMsg(
e.target.value
)
}

className="
w-full
border
h-32
rounded-xl
p-4
"

/>

</div>

)

}