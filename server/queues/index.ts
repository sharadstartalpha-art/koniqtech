type Job={

id:string

type:string

payload:any

}

const queue:Job[]=[]

export function pushJob(

job:Job

){

queue.push(job)

}

export function nextJob(){

return queue.shift()

}

export function queueSize(){

return queue.length

}