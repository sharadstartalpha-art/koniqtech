import prisma from "@/shared/lib/prisma"

export const dynamic="force-dynamic"

export default async function Page(){

const jobs=
await prisma.job.findMany({

where:{
scheduledDate:{
not:null
}
},

include:{
customer:true
},

orderBy:{
scheduledDate:"asc"
}

})

const now=
new Date()

const year=
now.getFullYear()

const month=
now.getMonth()

const first=
new Date(
year,
month,
1
)

const last=
new Date(
year,
month+1,
0
)

const days=
Array.from({

length:last.getDate()

})

return(

<div className="space-y-8">

<h1 className="text-5xl font-bold">

Calendar

</h1>

<div className="
grid
grid-cols-7
gap-4
">

{

days.map((_,i)=>{

const day=i+1

const rows=

jobs.filter(x=>

x.scheduledDate &&

new Date(
x.scheduledDate
).getDate()

===

day

)

return(

<div

key={day}

className="
bg-white
border
rounded-3xl
p-4
min-h-[180px]
"

>

<div className="
font-bold
mb-4
"

>

{day}

</div>

<div className="
space-y-2
">

{

rows.map(job=>(

<div

key={job.id}

className="
bg-blue-50
rounded-xl
p-3
text-sm
"

>

<div>

{job.title}

</div>

<div className="
text-slate-500
"

>

{

job.customer
.firstName

}

</div>

</div>

))

}

</div>

</div>

)

})

}

</div>

</div>

)

}