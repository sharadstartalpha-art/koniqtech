export default function Page(){

return(

<div className="max-w-3xl mx-auto">

<div className="bg-white rounded-3xl p-10">

<h1 className="text-4xl font-bold mb-8">

Create Customer

</h1>

<input
placeholder="Customer name"
className="w-full border p-4 rounded-xl mb-4"
/>

<input
placeholder="Email"
className="w-full border p-4 rounded-xl mb-4"
/>

<input
placeholder="Phone"
className="w-full border p-4 rounded-xl mb-4"
/>

<textarea
placeholder="Address"
className="w-full border p-4 rounded-xl mb-6"
/>

<button className="bg-blue-600 text-white px-8 py-4 rounded-xl">

Create

</button>

</div>

</div>

)

}