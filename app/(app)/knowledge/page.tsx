export default function Page(){

const docs=[

"Roof Installation SOP",

"Inspection Checklist",

"Warranty Guide",

"Sales Script"

]

return(

<div>

<h1 className="text-5xl font-bold mb-8">

Knowledge Base

</h1>

<div className="grid gap-5">

{

docs.map(

d=>(

<div

key={d}

className="bg-white rounded-3xl p-8 flex justify-between"

>

<span>

{d}

</span>

<button className="bg-blue-600 text-white px-5 py-2 rounded-xl">

Open

</button>

</div>

)

)

}

</div>

</div>

)

}