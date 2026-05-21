const apps=[

"Stripe",

"Twilio",

"OpenAI",

"Google Maps",

"Resend",

"Pinecone",

"Firebase",

"Redis"

]

export default function Integrations(){

return(

<div className="
bg-white
rounded-xl
p-8
">

<h1 className="
text-2xl
font-bold
mb-8
">

Integrations

</h1>

<div className="
grid
grid-cols-4
gap-5
">

{

apps.map(

a=>(

<div

key={a}

className="
border
rounded-xl
p-6
"

>

<h2>

{a}

</h2>

<button className="
mt-4
bg-blue-600
text-white
px-4
py-2
rounded-lg
">

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