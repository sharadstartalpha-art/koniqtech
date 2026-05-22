export default function Page(){

return(

<div>

<h1 className="text-5xl font-bold mb-8">

Webhooks Runtime

</h1>

<div className="space-y-5">

<div className="bg-white rounded-3xl p-8">

lead.created → SUCCESS

</div>

<div className="bg-white rounded-3xl p-8">

invoice.paid → SUCCESS

</div>

<div className="bg-white rounded-3xl p-8">

job.completed → RETRY

</div>

</div>

</div>

)

}