export default function Page(){

return(

<div className="bg-white p-10 rounded-3xl">

<h1 className="text-4xl font-bold mb-8">

Create Job

</h1>

<input
placeholder="Job title"
className="w-full border p-4 rounded-xl mb-4"
/>

<select
className="w-full border p-4 rounded-xl mb-4"
>

<option>Pending</option>

<option>Assigned</option>

<option>Completed</option>

</select>

<button className="bg-blue-600 text-white px-8 py-4 rounded-xl">

Create

</button>

</div>

)

}