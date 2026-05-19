import {Server}

from "socket.io"

export const io=

new Server({

cors:{

origin:

"https://koniqtech.com"

}

})

io.on(

"connection",

socket=>{

console.log(

socket.id

)

}

)