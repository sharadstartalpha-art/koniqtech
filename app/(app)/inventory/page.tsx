export default function Page(){

const items=[

{
name:"Roof Shingles",
qty:120
},

{
name:"Sealant",
qty:40
}

]

return(

<div className="space-y-8">

<h1 className="text-5xl font-bold">

Inventory

</h1>

<div className="bg-white rounded-3xl border overflow-hidden">

<table className="w-full">

<thead>

<tr>

<th className="p-5">

Item

</th>

<th>

Quantity

</th>

</tr>

</thead>

<tbody>

{

items.map((item,i)=>(

<tr
key={i}
className="border-t"
>

<td className="p-5">

{item.name}

</td>

<td>

{item.qty}

</td>

</tr>

))

}

</tbody>

</table>

</div>

</div>

)

}