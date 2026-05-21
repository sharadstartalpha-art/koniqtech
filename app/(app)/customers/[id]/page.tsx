export default function CustomerProfile(){

return(

<div className="space-y-6">

<div className="bg-white rounded-3xl border p-8">

<h1 className="text-3xl font-bold">

John Smith

</h1>

<p>

Dallas Texas

</p>

</div>

<div className="grid grid-cols-2 gap-6">

<Card title="Property">

Roof replacement

</Card>

<Card title="Address">

Dallas TX USA

</Card>

<Card title="Invoices">

4

</Card>

<Card title="Jobs">

12

</Card>

</div>

<div className="bg-white p-8 rounded-3xl border">

Notes

</div>

</div>

)

}

function Card({

title,

children

}:any){

return(

<div className="bg-white border p-8 rounded-3xl">

<h2>{title}</h2>

<div className="mt-4">

{children}

</div>

</div>

)

}