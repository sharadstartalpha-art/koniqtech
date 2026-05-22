export default function Page(){

const integrations=[

{
name:"PayPal",
status:"Connected"
},

{
name:"OpenAI",
status:"Connected"
},

{
name:"Twilio",
status:"Pending"
},

{
name:"Resend",
status:"Connected"
},

{
name:"Google Maps",
status:"Pending"
}

]

return(

<div>

<h1 className="text-5xl font-bold mb-8">

Real Integrations

</h1>

<div className="grid grid-cols-2 gap-6">

{

integrations.map(i=>(

<div
key={i.name}
className="bg-white rounded-3xl p-8 flex justify-between"
>

<div>

<h2 className="text-2xl font-bold">

{i.name}

</h2>

<p>

{i.status}

</p>

</div>

<button className="bg-blue-600 text-white px-6 py-3 rounded-xl">

Manage

</button>

</div>

))

}

</div>

</div>

)

}