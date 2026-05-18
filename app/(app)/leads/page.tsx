import {
getLeads
}

from
"@/modules/leads/actions/getLeads.action"

export default async function Leads(){

const leads=
await getLeads()

return(

<div className="p-10">

<h1 className="text-3xl">

Leads

</h1>

{

leads.map(

x=>(

<div
key={x.id}

className="border p-4 mt-3">

{x.firstName}

</div>

)

)

}

</div>

)

}