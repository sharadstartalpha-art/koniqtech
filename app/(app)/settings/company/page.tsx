export default function Page(){

return(

<div className="max-w-5xl">

<h1 className="text-5xl font-bold mb-8">

Company Settings

</h1>

<div className="bg-white rounded-3xl p-10 grid grid-cols-2 gap-6">

<input
placeholder="Company Name"
className="border p-5 rounded-xl"
/>

<input
placeholder="Phone"
className="border p-5 rounded-xl"
/>

<input
placeholder="Email"
className="border p-5 rounded-xl"
/>

<input
placeholder="Timezone"
className="border p-5 rounded-xl"
/>

<textarea

placeholder="Address"

className="border p-5 rounded-xl col-span-2"

/>

<button className="bg-blue-600 text-white px-8 py-4 rounded-xl col-span-2">

Save Company

</button>

</div>

</div>

)

}