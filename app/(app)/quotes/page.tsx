export default function Page(){

return(

<div className="space-y-8">

<h1 className="text-5xl font-bold">

Quotes

</h1>

<div className="bg-white rounded-3xl p-8">

<div className="space-y-4">

<Item
name="Roof install"
amount="$12000"
/>

<Item
name="Repair"
amount="$2500"
/>

</div>

</div>

</div>

)

}

function Item({

name,
amount

}:any){

return(

<div className="border rounded-xl p-5 flex justify-between">

<span>

{name}

</span>

<span>

{amount}

</span>

</div>

)

}