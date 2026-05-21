import{

listJobs

}

from "../queues/job.queue"

setInterval(

()=>{

const jobs=

listJobs()

console.log(

jobs

)

},

3000

)