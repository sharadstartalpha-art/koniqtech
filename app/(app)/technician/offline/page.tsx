"use client"

import {

useEffect,
useState

}

from "react"

export default function Page(){

const [online,setOnline]=
useState(true)

useEffect(()=>{

setOnline(
navigator.onLine
)

},[])

return(

<div>

<h1>

Status:

{

online?
"Online":
"Offline"

}

</h1>

</div>

)

}