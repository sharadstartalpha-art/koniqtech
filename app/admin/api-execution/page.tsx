export default function Page(){

return(

<div>

<h1 className="text-5xl font-bold mb-8">

API Execution

</h1>

<div className="space-y-5">

<div className="bg-white p-8 rounded-3xl">

POST /api/leads

200ms

SUCCESS

</div>

<div className="bg-white p-8 rounded-3xl">

POST /api/jobs

120ms

SUCCESS

</div>

<div className="bg-white p-8 rounded-3xl">

POST /api/paypal

500ms

RUNNING

</div>

</div>

</div>

)

}