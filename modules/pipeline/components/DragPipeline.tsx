"use client"

import {

DragDropContext,

Droppable,

Draggable

}

from
"@hello-pangea/dnd"

const stages=[

{

id:"new",

items:["Lead A"]

},

{

id:"proposal",

items:["Lead B"]

}

]

export default function DragPipeline(){

return(

<DragDropContext
onDragEnd={()=>{}}>

<div
className=
"grid grid-cols-2 gap-5">

{

stages.map(

stage=>(

<Droppable

droppableId=
{stage.id}

key={stage.id}

>

{

provided=>(

<div

ref={
provided.innerRef
}

{

...provided
.droppableProps

}

className=
"border p-5"

>

<h1>

{stage.id}

</h1>

{

stage.items.map(

(x,i)=>(

<Draggable

key={x}

draggableId=
{x}

index={i}

>

{

p=>(

<div

ref={
p.innerRef
}

{

...p
.draggableProps

}

{

...p
.dragHandleProps

}

className=
"border p-3 mt-3"

>

{x}

</div>

)

}

</Draggable>

)

)

}

</div>

)

}

</Droppable>

)

)

}

</div>

</DragDropContext>

)

}