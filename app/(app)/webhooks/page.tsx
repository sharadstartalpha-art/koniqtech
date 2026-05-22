export default function Page(){

return(

<div className="max-w-5xl">

<h1 className="text-5xl font-bold mb-8">

Webhooks

</h1>

<div className="bg-white rounded-3xl p-10 space-y-6">

<input

placeholder="Webhook URL"

className="w-full border p-5 rounded-xl"

/>

<select className="w-full border p-5 rounded-xl">

<option>

lead.created

</option>

<option>

job.completed

</option>

<option>

invoice.paid

</option>

<option>

customer.created

</option>

</select>

<button className="bg-blue-600 text-white px-8 py-4 rounded-xl">

Create Webhook

</button>

</div>

</div>

)

}