export default function JobBoard(){

const jobs=[

"Roof Install",

"HVAC Repair",

"Pipe Replacement"

]

return(

<div className="p-8 space-y-6">

<h1 className="text-4xl font-bold">

Jobs

</h1>

{

jobs.map(job=>(

<div
key={job}
className="
bg-white
rounded-xl
p-5
shadow
"
>

{job}

</div>

))

}

</div>

)

}