export default function Page(){

return(

<div className="space-y-8">

<h1 className="text-5xl font-bold">

Jobs

</h1>

<div className="bg-white rounded-3xl p-8">

<div className="space-y-5">

<Job
name="Roof Replacement"
tech="Mike"
status="Assigned"
/>

<Job
name="Inspection"
tech="John"
status="Completed"
/>

</div>

</div>

</div>

)

}

function Job({

name,
tech,
status

}:any){

return(

<div className="border rounded-xl p-5">

<h2 className="font-bold">

{name}

</h2>

<p>

Technician:

{tech}

</p>

<p>

Status:

{status}

</p>

</div>

)

}