export default function Page(){

return(

<div className="space-y-8">

<h1 className="text-5xl font-bold">

Customers

</h1>

<div className="grid grid-cols-2 gap-8">

<div className="bg-white rounded-3xl p-8">

<h2 className="text-2xl font-bold">

Customer Profile

</h2>

<p className="mt-4">

John Doe

</p>

<p>

Address:

Miami

</p>

<p>

Property:

Roofing

</p>

</div>

<div className="bg-white rounded-3xl p-8">

<h2 className="font-bold">

Job History

</h2>

<div className="mt-6 space-y-3">

<div className="bg-slate-100 p-4 rounded">

Roof Repair

</div>

<div className="bg-slate-100 p-4 rounded">

Inspection

</div>

</div>

</div>

</div>

</div>

)

}