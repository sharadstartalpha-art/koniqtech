export default function Page(){

const items=[

"DNS",

"SSL",

"PayPal",

"Maps",

"OpenAI",

"Twilio",

"Redis",

"Backups",

"Monitoring"

]

return(

<div className="
space-y-5
">

<h1 className="
text-5xl
font-bold
">

Launch

</h1>

{items.map(i=>(

<div
key={i}
className="
bg-white
border
rounded-xl
p-5
flex
justify-between
"
>

<span>

{i}

</span>

<span>

READY

</span>

</div>

))}

</div>

)

}