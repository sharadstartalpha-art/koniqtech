"use client"

import {socket}

from "@/shared/lib/socket"

export default function TechLive(){

socket.on(

"checkin",

(x)=>console.log(x)

)

return(

<div className="bg-white rounded-xl p-6">

Technician Socket

</div>

)

}