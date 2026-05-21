export default function LeadEdit(){

return(

<div className="bg-white p-8 rounded-3xl border">

<h1 className="text-3xl font-bold mb-8">

Edit Lead

</h1>

<input className="border p-4 rounded-xl w-full mb-4"/>

<select className="border p-4 rounded-xl w-full">

<option>New</option>

<option>Contacted</option>

<option>Estimate</option>

<option>Won</option>

<option>Lost</option>

</select>

</div>

)

}