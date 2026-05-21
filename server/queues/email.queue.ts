const queue:any[]=[]

export function addEmail(

data:any

){

queue.push(data)

}

export function getEmails(){

return queue

}