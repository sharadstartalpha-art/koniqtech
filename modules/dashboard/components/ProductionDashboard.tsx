export default function ProductionDashboard(){

const cards=[

{
title:"Revenue",
value:"$82,400"
},

{
title:"Leads",
value:"241"
},

{
title:"Jobs",
value:"43"
},

{
title:"Customers",
value:"112"
}

]

return(

<div className="space-y-8">

<div>

<h1 className="
text-5xl
font-bold
">

Dashboard

</h1>

<p className="text-slate-500">

Operations overview

</p>

</div>

<div className="
grid
grid-cols-4
gap-6
">

{cards.map(card=>(

<div
key={card.title}
className="
bg-white
rounded-2xl
shadow-sm
p-8
border
"
>

<p className="text-slate-500">

{card.title}

</p>

<h2 className="
text-4xl
font-bold
mt-4
">

{card.value}

</h2>

</div>

))}

</div>

<div className="
bg-white
rounded-2xl
p-8
shadow-sm
h-[420px]
">

Revenue Analytics Chart

</div>

</div>

)

}