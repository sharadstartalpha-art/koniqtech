"use client"

const invoices=[

{

id:"INV001",

amount:19900,

status:"paid"

},

{

id:"INV002",

amount:12000,

status:"pending"

}

]

export default function InvoiceTable(){

return(

<table
className=
"w-full border">

<thead>

<tr>

<th>

Invoice

</th>

<th>

Amount

</th>

<th>

Status

</th>

</tr>

</thead>

<tbody>

{

invoices.map(

x=>(

<tr
key={x.id}>

<td>

{x.id}

</td>

<td>

${x.amount}

</td>

<td>

{x.status}

</td>

</tr>

)

)

}

</tbody>

</table>

)

}