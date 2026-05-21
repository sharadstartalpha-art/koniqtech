export default function Page(){

const leads=[

{
name:"John Roofing",
score:94,
reason:"High intent"
},

{
name:"Mike Repairs",
score:72,
reason:"Medium budget"
}

]

return(

<div className="space-y-8">

<h1 className="text-5xl font-bold">

AI Lead Scoring

</h1>

<div className="grid grid-cols-2 gap-6">

{

leads.map((lead,i)=>(

<div
key={i}
className="bg-white rounded-3xl p-8 border"
>

<div className="flex justify-between">

<h2 className="text-2xl font-bold">

{lead.name}

</h2>

<div className="text-4xl font-bold text-blue-600">

{lead.score}

</div>

</div>

<p className="mt-5 text-slate-500">

{lead.reason}

</p>

</div>

))

}

</div>

</div>

)

}