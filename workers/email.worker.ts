import {Worker}

from "bullmq"

import {redis}

from "@/queues/connection"

new Worker(

"email",

async job=>{

console.log(

job.data

)

},

{

connection:

redis

}

)