export default function Page(){

return(

<div>

<h1 className="text-5xl font-bold mb-8">

Scheduler

</h1>

<div className="bg-white rounded-3xl p-8">

<div className="grid grid-cols-7 gap-4">

{

Array.from({

length:35

}).map((_,i)=>(

<div

key={i}

className="border h-40 rounded-xl p-3"

>

<div>

{i+1}

</div>

<div className="mt-3 bg-blue-100 rounded p-2">

Roof Repair

</div>

</div>

))

}

</div>

</div>

</div>

)

}