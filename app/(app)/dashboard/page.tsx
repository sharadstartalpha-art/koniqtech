import StatCard
from "@/shared/components/ui/StatCard"

export default function Dashboard(){

return(

<div className="
p-8
bg-slate-50
min-h-screen
">

<h1 className="
text-4xl
font-bold
mb-8
">

Dashboard

</h1>

<div className="
grid
grid-cols-4
gap-5
">

<StatCard
title="Revenue"
value="$82,400"
/>

<StatCard
title="Leads"
value="241"
/>

<StatCard
title="Jobs"
value="43"
/>

<StatCard
title="Customers"
value="112"
/>

</div>

</div>

)

}