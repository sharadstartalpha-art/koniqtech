export default function Page(){

const memories=[

"Roof pricing guide",

"Customer objections",

"Installation SOP",

"Inspection checklist"

]

return(

<div>

<h1 className="text-5xl font-bold mb-8">

AI Memory

</h1>

<div className="space-y-5">

{

memories.map(

m=>(

<div

key={m}

className="bg-white rounded-3xl p-8"

>

{m}

</div>

)

)

}

</div>

</div>

)

}