import prisma from "@/shared/lib/prisma"

export const dynamic="force-dynamic"

export default async function Page({

params

}:any){

const events=
await prisma.event.findMany({

where:{
jobId:String(
params.id
)
},

orderBy:{
startTime:"desc"
}

})

return(

<div className="space-y-8">

<div>

<h1 className="
text-5xl
font-bold
">

Timeline

</h1>

<p className="
text-slate-500
mt-2
">

Job activity history

</p>

</div>

<div className="space-y-5">

{

events.length===0

?

<div className="
bg-white
border
rounded-3xl
p-10
text-slate-500
">

No timeline events

</div>

:

events.map(event=>(

<div

key={event.id}

className="
bg-white
border
rounded-3xl
p-6
"

>

<div className="
flex
justify-between
items-start
"

>

<div>

<h2 className="
font-bold
text-lg
">

{event.title}

</h2>

<p className="
text-slate-500
mt-2
">

Start:

{

event.startTime
.toLocaleDateString()

}

{

" "
}

{

event.startTime
.toLocaleTimeString()

}

</p>

<p className="
text-slate-500
"

>

End:

{

event.endTime
.toLocaleDateString()

}

{

" "
}

{

event.endTime
.toLocaleTimeString()

}

</p>

</div>

<div className="
px-4
py-2
bg-slate-100
rounded-xl
text-sm
"

>

Timeline

</div>

</div>

</div>

))

}

</div>

</div>

)

}