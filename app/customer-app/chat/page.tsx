"use client"

import { useState }

from "react"

export default function Page(){

const [msg,setMsg]=
useState("")

return(

<div>

<input

value={msg}

onChange={

e=>setMsg(
e.target.value
)

}

/>

</div>

)

}