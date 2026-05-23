"use client"

import { io }

from "socket.io-client"

export default function Page(){

const socket=
io()

socket.emit(

"crm",

"hello"

)

return(

<div>

Realtime CRM

</div>

)

}