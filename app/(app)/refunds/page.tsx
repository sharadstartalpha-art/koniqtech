export default function Page(){

return(

<div className="space-y-8">

<h1 className="text-5xl">

Refunds

</h1>

<div className="bg-white p-8 rounded-3xl">

<table className="w-full">

<thead>

<tr>

<th>Invoice</th>
<th>Amount</th>
<th>Status</th>

</tr>

</thead>

<tbody>

<tr>

<td>#INV1</td>
<td>$250</td>
<td>Pending</td>

</tr>

</tbody>

</table>

</div>

</div>

)

}