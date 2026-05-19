import {Worker}

from "bullmq"

import {redis}

from "@/queues/connection"

new Worker(

"sms",

async job=>{

console.log(job.data)

},

{

connection:redis

}

)