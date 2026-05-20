import {Server}

from "socket.io"

const io=

new Server(

3001,

{

cors:{

origin:"*"

}

}

)

io.on(

"connection",

socket=>{

console.log(

"connected"

)

socket.on(

"tech-location",

data=>{

io.emit(

"live-location",

data

)

}

)

}

)

console.log(

"socket running"

)