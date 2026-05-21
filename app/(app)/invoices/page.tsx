export default function Page(){

return(

<div className="space-y-8">

<h1 className="text-5xl font-bold">

Invoices

</h1>

<div className="bg-white rounded-3xl border overflow-hidden">

<table className="w-full">

<thead>

<tr>

<th className="p-5">

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

<tr>

<td className="p-5">

INV-1

</td>

<td>

$1200

</td>

<td>

Paid

</td>

</tr>

</tbody>

</table>

</div>

</div>

)

}