export default function Page(){

return(

<div className="space-y-8">

<h1 className="text-5xl font-bold">

Forms

</h1>

<div className="grid grid-cols-3 gap-6">

<FormCard
title="Lead Form"
/>

<FormCard
title="Inspection Form"
/>

<FormCard
title="Estimate Form"
/>

</div>

</div>

)

}

function FormCard({

title

}:any){

return(

<div className="bg-white rounded-3xl p-8 border">

<h2 className="text-2xl font-bold">

{title}

</h2>

<button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl">

Open Form

</button>

</div>

)

}