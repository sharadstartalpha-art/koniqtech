export default function Page(){

return(

<div className="space-y-8">

<h1 className="text-5xl font-bold">

Day Schedule

</h1>

<div className="bg-white rounded-3xl p-8">

{

Array.from({

length:12

}).map((_,i)=>(

<div

key={i}

className="border-b py-5 flex gap-8"

>

<div>

{i+8}:00

</div>

<div>

Roof Inspection

</div>

</div>

))

}

</div>

</div>

)

}