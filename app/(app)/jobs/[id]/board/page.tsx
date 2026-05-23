"use client"

import {
DragDropContext,
Droppable,
Draggable
} from "@hello-pangea/dnd"

import {
useEffect,
useState
} from "react"

const COLUMNS=[

"scheduled",
"in_progress",
"completed"

]

export default function Page({

params

}:any){

const [jobs,setJobs]=
useState([])

useEffect(()=>{

load()

},[])

async function load(){

const res=
await fetch(

`/api/jobs/status?jobId=${params.id}`

)

setJobs(

await res.json()

)

}

async function move(

result:any

){

if(

!result.destination

)return

const item=

jobs.find(

(x:any)=>

x.id===

result.draggableId

)

if(!item)return

const status=

result.destination
.droppableId

await fetch(

"/api/jobs/status",

{

method:"PUT",

headers:{

"Content-Type":

"application/json"

},

body:JSON.stringify({

id:(item as any).id,
status

})

}

)

load()

}

return(

<div className="space-y-8">

<h1 className="text-5xl font-bold">

Job Board

</h1>

<DragDropContext

onDragEnd={move}

>

<div className="grid grid-cols-3 gap-6">

{

COLUMNS.map(

col=>(

<Droppable

droppableId={col}

key={col}

>

{provided=>(

<div

ref={
provided.innerRef
}

{

...provided
.droppableProps

}

className="
bg-white
border
rounded-3xl
p-6
min-h-[600px]
"

>

<h2 className="
font-bold
text-xl
mb-6
capitalize
">

{

col.replace(
"_",
" "
)

}

</h2>

{

jobs

.filter(

(x:any)=>

x.status===col

)

.map(

(

job:any,
index

)=>(

<Draggable

draggableId={
job.id
}

index={index}

key={job.id}

>

{p=>(

<div

ref={
p.innerRef
}

{

...p.draggableProps

}

{

...p.dragHandleProps

}

className="
bg-slate-50
border
rounded-2xl
p-5
mb-4
"

>

<h3 className="font-semibold">

{job.title}

</h3>

<p className="text-sm text-slate-500">

{

job.customer
?.firstName

}

</p>

</div>

)}

</Draggable>

)

)

}

{

provided.placeholder

}

</div>

)}

</Droppable>

)

)

}

</div>

</DragDropContext>

</div>

)

}