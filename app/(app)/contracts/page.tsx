export default function Page(){

return(

<div className="space-y-8">

<h1 className="text-5xl font-bold">

Contracts

</h1>

<div className="bg-white rounded-3xl p-8">

<div className="space-y-4">

<Item
name="Roof Contract"
/>

<Item
name="HVAC Agreement"
/>

</div>

</div>

</div>

)

}

function Item({

name

}:any){

return(

<div className="border rounded-xl p-5 flex justify-between">

<span>

{name}

</span>

<button className="bg-black text-white px-5 py-2 rounded-xl">

View

</button>

</div>

)

}