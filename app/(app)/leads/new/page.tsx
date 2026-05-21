export default function NewLead(){

return(

<div className="space-y-8">

<h1 className="text-3xl font-bold">

Create Lead

</h1>

<div className="bg-white p-8 rounded-3xl border">

<div className="grid grid-cols-2 gap-6">

<input placeholder="Name" className="border p-4 rounded-xl"/>

<input placeholder="Email" className="border p-4 rounded-xl"/>

<input placeholder="Phone" className="border p-4 rounded-xl"/>

<select className="border p-4 rounded-xl">

<option>Roofing</option>
<option>HVAC</option>
<option>Plumbing</option>

</select>

<textarea

placeholder="Notes"

className="border p-4 rounded-xl col-span-2 h-40"

/>

</div>

<div className="mt-8 flex gap-4">

<button className="bg-blue-600 text-white px-8 py-4 rounded-xl">

Save Lead

</button>

<button className="border px-8 py-4 rounded-xl">

AI Score

</button>

</div>

</div>

</div>

)

}