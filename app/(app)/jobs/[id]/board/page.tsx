export default function Page(){

return(

<div>

<h1 className="text-5xl font-bold mb-8">

Job Board

</h1>

<div className="grid grid-cols-3 gap-6">

<Card title="Scheduled"/>

<Card title="In Progress"/>

<Card title="Completed"/>

</div>

</div>

)

}

function Card({title}:any){

return(

<div className="bg-white rounded-3xl border p-8 min-h-[500px]">

<h2 className="font-bold text-xl">

{title}

</h2>

</div>

)

}