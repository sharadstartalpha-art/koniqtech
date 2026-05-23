"use client"

import {

useEffect,
useState

}

from "react"

export default function Page(){

const [pos,setPos]=
useState<any>()

useEffect(()=>{

navigator.geolocation
.watchPosition(

x=>setPos(x)

)

},[])

return(

<div>

{

JSON.stringify(
pos
)

}

</div>

)

}