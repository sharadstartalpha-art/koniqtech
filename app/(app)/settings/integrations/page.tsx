export default function Page(){

const integrations=[

"Stripe",

"PayPal",

"Twilio",

"Resend",

"OpenAI"

]

return(

<div>

<h1 className="text-5xl font-bold mb-8">

Integrations

</h1>

<div className="grid grid-cols-2 gap-6">

{

integrations.map(

i=>(

<div

key={i}

className="bg-white rounded-3xl p-8 flex justify-between"

>

<span>

{i}

</span>

<button className="bg-green-600 text-white px-5 py-2 rounded-xl">

Connect

</button>

</div>

)

)

}

</div>

</div>

)

}