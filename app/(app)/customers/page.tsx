import {
getCustomers
}

from
"@/modules/customers/actions/getCustomers.action"

export default async function Customers(){

const data=
await getCustomers()

return(

<div className="p-10">

{

data.map(

x=>(

<div
key={x.id}

className="border p-5">

{x.firstName}

</div>

)

)

}

</div>

)

}