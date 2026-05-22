export default function Page(){

return(

<div>

<h1 className="text-5xl font-bold mb-8">

OpenAI Execution

</h1>

<div className="grid grid-cols-4 gap-6">

<Card
title="Requests"
value="28,420"
/>

<Card
title="Tokens"
value="2.8M"
/>

<Card
title="Latency"
value="310ms"
/>

<Card
title="Errors"
value="4"
/>

</div>

<div className="bg-white rounded-3xl p-10 mt-8">

<h2 className="text-2xl font-bold">

Recent Executions

</h2>

<div className="space-y-4 mt-8">

<Item text="Lead scoring"/>

<Item text="Call summary"/>

<Item text="Quote generation"/>

</div>

</div>

</div>

)

}

function Card({title,value}:any){

return(

<div className="bg-white rounded-3xl p-8">

<p>{title}</p>

<h2 className="text-4xl font-bold">

{value}

</h2>

</div>

)

}

function Item({text}:any){

return(

<div className="bg-slate-100 p-5 rounded-xl">

{text}

</div>

)

}