import{

getEmails

}

from "../queues/email.queue"

setInterval(

()=>{

console.log(

getEmails()

)

},

5000

)