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

params.crm ||

"roofing"

const company=

params.company ||

""

const email=

params.email ||

""

return(

<div className="min-h-screen bg-slate-100 flex items-center justify-center">

<div className="bg-white rounded-3xl p-12 w-[720px] shadow-xl">

<h1 className="text-4xl font-bold">

Subscribe

</h1>

<p className="mt-4 text-slate-500">

CRM Selected:

<span className="font-semibold ml-2">

{crm}

</span>

</p>

<div className="mt-8 border rounded-3xl p-8">

<div className="flex justify-between">

<span>

Plan

</span>

<span>

PRO

</span>

</div>

<div className="flex justify-between mt-5">

<span>

Company

</span>

<span>

{company}

</span>

</div>

<div className="flex justify-between mt-5">

<span>

Email

</span>

<span>

{email}

</span>

</div>

<div className="flex justify-between mt-5">

<span>

Billing

</span>

<span>

$199 / month

</span>

</div>

</div>

<a

href="/api/paypal/create"

className="block mt-8 bg-blue-600 text-white text-center p-5 rounded-2xl"

>

Continue To PayPal

</a>

</div>

</div>

)

}