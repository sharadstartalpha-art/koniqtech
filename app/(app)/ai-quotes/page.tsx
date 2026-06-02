export const dynamic = "force-dynamic";
import prisma from "@/shared/lib/prisma"

export default async function Page(){

const quotes=
await prisma.quote.findMany({

include:{
customer:true
},

orderBy:{
createdAt:"desc"
}

})

return(

<div className="space-y-8">

<div className="
flex
justify-between
items-center
">

<div>

<h1 className="
text-5xl
font-bold
">

AI Quotes

</h1>

<p className="
text-slate-500
mt-2
">

AI estimate generation

</p>

</div>

<button className="
bg-blue-600
text-white
px-6
py-3
rounded-2xl
">

Generate Quote

</button>

</div>

<div className="
grid
grid-cols-3
gap-6
">

<div className="
bg-white
border
rounded-3xl
p-8
space-y-5
">

<h2 className="
font-bold
text-xl
">

AI Generator

</h2>

<textarea

placeholder="
Describe project
"

className="
w-full
h-48
border
rounded-2xl
p-4
"

/>

<button className="
w-full
bg-blue-600
text-white
p-4
rounded-2xl
">

Generate

</button>

</div>

<div className="
col-span-2
space-y-4
">

{

quotes.map(

(q:any)=>(

<div

key={q.id}

className="
bg-white
border
rounded-3xl
p-6
"

>

<h2 className="
font-bold
">

{

q.customer

?.firstName

??

"Customer"

}

</h2>

<p className="
text-slate-500
">

Quote Value

</p>

<h3 className="
text-3xl
font-bold
mt-3
">

$

{

Number(
q.total
??0
)

}

</h3>

</div>

)

)

}

</div>

</div>

</div>

)

}