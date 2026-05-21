export default function Page(){

return(

<div className="space-y-8">

<h1 className="text-5xl font-bold">

Create Invoice

</h1>

<div className="bg-white rounded-3xl p-10 space-y-5">

<input
placeholder="Customer"
className="w-full border p-5 rounded-xl"
/>

<input
placeholder="Amount"
className="w-full border p-5 rounded-xl"
/>

<input
type="date"
className="w-full border p-5 rounded-xl"
/>

<select className="w-full border p-5 rounded-xl">

<option>

Pending

</option>

<option>

Paid

</option>

</select>

<button className="bg-blue-600 text-white px-8 py-4 rounded-xl">

Save Invoice

</button>

</div>

</div>

)

}