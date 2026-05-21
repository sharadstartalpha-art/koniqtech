export default function Page(){

return(

<div className="space-y-8">

<h1 className="text-5xl font-bold">

Dispatch

</h1>

<div className="bg-white rounded-3xl p-8">

<Card
tech="Mike"
job="Roof repair"
/>

<Card
tech="John"
job="Inspection"
/>

</div>

</div>

)

}

function Card({

tech,
job

}:any){

return(

<div className="border rounded-xl p-5 mb-4">

<p>

Tech:

{tech}

</p>

<p>

Job:

{job}

</p>

</div>

)

}