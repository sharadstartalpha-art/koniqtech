export default function Page(){

const dispatch=[

{
tech:"Mike",
job:"Roof Repair",
status:"Driving"
},

{
tech:"Sarah",
job:"Inspection",
status:"Working"
}

]

return(

<div>

<h1 className="text-5xl font-bold mb-8">

Live Dispatch

</h1>

<div className="space-y-6">

{

dispatch.map(

d=>(

<div
key={d.tech}
className="bg-white rounded-3xl p-8 flex justify-between"
>

<div>

<h2 className="text-2xl font-bold">

{d.tech}

</h2>

<p>

{d.job}

</p>

</div>

<div>

{d.status}

</div>

</div>

)

)

}

</div>

</div>

)

}