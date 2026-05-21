import{

listJobs

}

from "../queues/job.queue"

setInterval(

()=>{

console.log(

listJobs()

)

},

5000

)