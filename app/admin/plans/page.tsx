export default function PlansPage(){

return(

<div className="grid grid-cols-3 gap-8">

<Card crm="Roofing"/>

<Card crm="HVAC"/>

<Card crm="Plumbing"/>

<Card crm="Landscaping"/>

</div>

)

}

function Card({

crm

}:any){

return(

<div className="bg-white p-8 rounded-3xl">

<h2 className="text-2xl font-bold">

{crm}

</h2>

<p>

$199/month

</p>

</div>

)

}