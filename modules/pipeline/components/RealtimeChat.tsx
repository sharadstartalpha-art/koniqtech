"use client"

import {

io

}

from
"socket.io-client"

const socket=

io(
"http://localhost:3001"
)

export default function Chat(){

socket.on(

"message",

msg=>{

console.log(
msg
)

}

)

return(

<div>

Realtime Chat

</div>

)

}