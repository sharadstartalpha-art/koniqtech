export default function Page(){

return(

<div>

<h1 className="text-5xl font-bold mb-8">

Observability

</h1>

<div className="grid grid-cols-3 gap-6">

<Box
t="CPU"
v="22%"
/>

<Box
t="RAM"
v="1.2GB"
/>

<Box
t="Errors"
v="2"
/>

</div>

</div>

)

}

function Box({t,v}:any){

return(

<div className="bg-white rounded-3xl p-8">

<p>{t}</p>

<h2 className="text-4xl font-bold">

{v}

</h2>

</div>

)

}