"use client"

export default function Dispatch(){

const techs=[

"Mike",
"John",
"Alex"

]

const jobs=[

"Roof Repair",
"HVAC Install",
"Plumbing Visit"

]

return(

<div className="space-y-6">

<div className="flex justify-between">

<h1 className="text-2xl font-semibold">

Dispatch Board

</h1>

<button className="bg-blue-600 text-white px-4 py-2 rounded-lg">

Assign Job

</button>

</div>

<div className="grid grid-cols-3 gap-6">

<div className="bg-white p-6 rounded-xl">

<h2 className="font-semibold mb-4">

Technicians

</h2>

{

techs.map(x=>(

<div
key={x}
className="border p-3 rounded mb-3">

{x}

</div>

))

}

</div>

<div className="col-span-2 bg-white rounded-xl p-6">

<h2 className="font-semibold mb-4">

Schedule

</h2>

{

jobs.map(x=>(

<div
key={x}
className="bg-slate-100 p-4 rounded mb-3">

{x}

</div>

))

}

</div>

</div>

</div>

)

}