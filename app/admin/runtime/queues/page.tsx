export default function Page(){

return(

<div>

<h1 className="text-5xl font-bold mb-8">

Queues

</h1>

<div className="grid grid-cols-2 gap-6">

<Q title="AI Queue"/>

<Q title="Email Queue"/>

<Q title="Webhook Queue"/>

<Q title="Billing Queue"/>

</div>

</div>

)

}

function Q({title}:any){

return(

<div className="bg-white rounded-3xl p-8">

<h2 className="font-bold">

{title}

</h2>

<p className="mt-4">

Healthy

</p>

</div>

)

}