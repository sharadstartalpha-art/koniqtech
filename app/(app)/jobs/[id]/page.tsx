export default function Page(){

return(

<div className="space-y-8">

<h1 className="text-5xl font-bold">

Job

</h1>

<div className="bg-white rounded-3xl p-8">

<p>

Job:

Roof Replacement

</p>

<p>

Technician:

Mike

</p>

<p>

Status:

Assigned

</p>

<p>

Completion:

45%

</p>

</div>

<div className="bg-white rounded-3xl p-8">

<h2>

Photos

</h2>

<div className="grid grid-cols-4 gap-4 mt-5">

{

Array.from({

length:4

}).map((_,i)=>(

<div
key={i}
className="h-40 bg-slate-100 rounded-xl"
/>

))

}

</div>

</div>

</div>

)

}