export default function Page(){

const jobs=[

{
title:"Roof Inspection",
customer:"John Smith",
time:"10:00 AM",
status:"Assigned"
},

{
title:"Repair Visit",
customer:"Mike Home",
time:"1:00 PM",
status:"In Progress"
}

]

return(

<div className="max-w-md mx-auto">

<h1 className="text-5xl font-bold mb-8">

Technician App

</h1>

<div className="space-y-6">

{

jobs.map(

j=>(

<div
key={j.title}
className="bg-white rounded-3xl p-8"
>

<h2 className="text-2xl font-bold">

{j.title}

</h2>

<p>

{j.customer}

</p>

<p>

{j.time}

</p>

<div className="mt-4">

<span className="bg-blue-100 px-4 py-2 rounded-xl">

{j.status}

</span>

</div>

<button className="mt-6 bg-green-600 text-white px-6 py-3 rounded-xl">

Complete

</button>

</div>

)

)

}

</div>

</div>

)

}