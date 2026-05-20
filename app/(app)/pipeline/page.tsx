export default function Pipeline(){

return(

<div>

<h1 className="text-4xl text-slate-900 mb-8">

Sales Pipeline

</h1>

<div className="grid grid-cols-4 gap-6">

<Col t="New"/>

<Col t="Quoted"/>

<Col t="Won"/>

<Col t="Lost"/>

</div>

</div>

)

}

function Col({t}:any){

return(

<div className="bg-white p-6 rounded-3xl min-h-[600px]">

<h2 className="font-bold">

{t}

</h2>

</div>

)

}