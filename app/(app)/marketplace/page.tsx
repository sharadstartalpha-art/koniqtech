export default function Page(){

const apps=[
"QuickBooks",
"Twilio ",
"OpenAI",
"PayPal",
"Maps"
]

return(

<div className="grid grid-cols-5 gap-6">

{apps.map(a=>(

<div
key={a}
className="
bg-white
border
rounded-3xl
p-8
"
>

{a}

</div>

))}

</div>

)

}