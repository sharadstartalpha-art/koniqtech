export default function Page(){

return(

<div className="space-y-8">

<h1 className="text-5xl font-bold">

Quote

</h1>

<div className="bg-white rounded-3xl p-10">

<h2 className="text-2xl font-bold">

Roof Replacement

</h2>

<div className="space-y-3 mt-6">

<Row
label="Materials"
value="$8000"
/>

<Row
label="Labor"
value="$3000"
/>

<Row
label="Permit"
value="$1000"
/>

</div>

<div className="mt-8 border-t pt-6">

<h2 className="text-3xl font-bold">

Total: $12000

</h2>

</div>

</div>

</div>

)

}

function Row({

label,
value

}:any){

return(

<div className="flex justify-between bg-slate-100 rounded-xl p-4">

<span>

{label}

</span>

<span>

{value}

</span>

</div>

)

}