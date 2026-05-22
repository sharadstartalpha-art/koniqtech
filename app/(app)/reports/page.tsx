export default function Page(){

return(

<div>

<h1 className="text-5xl font-bold mb-8">

Reports

</h1>

<div className="grid grid-cols-4 gap-6">

<Card
title="Revenue"
value="$82k"
/>

<Card
title="Leads"
value="241"
/>

<Card
title="Jobs"
value="58"
/>

<Card
title="Invoices"
value="$22k"
/>

</div>

<div className="bg-white rounded-3xl p-10 mt-8">

<div className="h-[500px] bg-slate-100 rounded-3xl flex items-center justify-center">

Analytics Chart

</div>

</div>

</div>

)

}

function Card({
title,
value
}:any){

return(

<div className="bg-white rounded-3xl p-8">

<p>

{title}

</p>

<h2 className="text-4xl font-bold">

{value}

</h2>

</div>

)

}