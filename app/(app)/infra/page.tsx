export default function Infra(){

const infra=[

"postgres",

"redis",

"s3",

"pinecone",

"socket",

"twilio",

"stripe",

"resend"

]

return(

<div className="
grid
grid-cols-4
gap-5
">

{

infra.map(

i=>(

<div

key={i}

className="
bg-white
rounded-xl
p-6
"

>

<h2>

{i}

</h2>

<p className="
text-green-600
">

online

</p>

</div>

)

)

}

</div>

)

}