export default function Page(){

return(

<div className="space-y-8">

<h1 className="text-5xl font-bold">

Lead Details

</h1>

<div className="grid grid-cols-3 gap-8">

<div className="bg-white rounded-3xl p-8">

<h2 className="font-bold">

Lead Profile

</h2>

<p className="mt-5">

John Roofing

</p>

<p>

AI Score:92

</p>

<p>

Stage:Estimate

</p>

</div>

<div className="bg-white rounded-3xl p-8 col-span-2">

<h2 className="font-bold">

Timeline

</h2>

<div className="space-y-3 mt-5">

<Item text="Lead created"/>

<Item text="Call completed"/>

<Item text="Estimate sent"/>

</div>

</div>

</div>

</div>

)

}

function Item({

text

}:any){

return(

<div className="bg-slate-100 p-4 rounded">

{text}

</div>

)

}