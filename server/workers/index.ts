import {

nextJob

}

from "@/server/queues"

export async function startWorker(){

while(true){

const job=

nextJob()

if(job){

console.log(

"processing",

job.id

)

}

await new Promise(

r=>

setTimeout(

r,

1000

)

)

}

}