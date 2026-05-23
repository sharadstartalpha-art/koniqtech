export default function Page(){

const hooks=[

"PayPal",

"Twilio",

"OpenAI",

"GPS",

"Notifications"

]

return(

<div className="space-y-4">

<h1 className="
text-5xl
font-bold
">

Webhooks

</h1>

{hooks.map(h=>(

<div
key={h}
className="
bg-white
border
rounded-xl
p-5
"
>

{h}

</div>

))}

</div>

)

}