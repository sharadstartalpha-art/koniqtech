export const dynamic="force-dynamic"

type Props={

searchParams:Promise<{

crm?:string

company?:string

email?:string

}>

}

export default async function PaypalPage({

searchParams

}:Props){

const params=

await searchParams

const crm=

params.crm||

"roofing"

const company=

params.company||

"-"

const email=

params.email||

"-"

return(

<div className="max-w-5xl mx-auto p-10">

<div className="bg-white rounded-3xl p-12 shadow">

<h1 className="text-6xl font-bold mb-8">

Subscribe

</h1>

<p className="text-xl text-slate-500 mb-10">

CRM Selected:

<b className="ml-3">

{crm}

</b>

</p>

<div className="border rounded-3xl p-10 space-y-8">

<div className="flex justify-between">

<span>

Plan

</span>

<b>

PRO

</b>

</div>

<div className="flex justify-between">

<span>

Company

</span>

<b>

{company}

</b>

</div>

<div className="flex justify-between">

<span>

Email

</span>

<b>

{email}

</b>

</div>

<div className="flex justify-between">

<span>

Billing

</span>

<b>

$199 / month

</b>

</div>

</div>

<a

href="/api/paypal/create"

className="block w-full mt-10 bg-blue-600 text-white text-center rounded-2xl p-5 text-xl font-semibold"

>

Continue To PayPal

</a>

</div>

</div>

)

}