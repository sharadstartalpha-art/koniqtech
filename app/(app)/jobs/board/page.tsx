import prisma from "@/shared/lib/prisma"

export default async function Page(){

const jobs=

await prisma.job.findMany()

const cols=[

"scheduled",
"in_progress",
"completed",
"cancelled"

]

return(

<div>

<h1 className="
text-4xl
font-semibold
mb-8
">

Job Board

</h1>

<div className="
grid
grid-cols-4
gap-5
">

{

cols.map(

c=>(

<div
key={c}
className="
bg-white

border

rounded-3xl

p-5
"
>

<h2 className="
font-semibold
mb-5
">

{c}

</h2>

<div className="
space-y-3
">

{

jobs

.filter(
x=>
x.status===c
)

.map(

x=>(

<div

key={x.id}

className="
p-4

rounded-xl

bg-slate-50
"

>

{x.title}

</div>

)

)

}

</div>

</div>

)

)

}

</div>

</div>

)

}