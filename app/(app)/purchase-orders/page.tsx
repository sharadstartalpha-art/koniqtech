export default function Page(){

return(

<div>

<h1 className="text-5xl font-bold mb-8">

Purchase Orders

</h1>

<div className="bg-white rounded-3xl p-10">

<table className="w-full">

<thead>

<tr>

<th>

PO

</th>

<th>

Vendor

</th>

<th>

Amount

</th>

</tr>

</thead>

<tbody>

<tr>

<td>

PO-101

</td>

<td>

ABC Roofing

</td>

<td>

$1200

</td>

</tr>

<tr>

<td>

PO-102

</td>

<td>

HVAC Supply

</td>

<td>

$820

</td>

</tr>

</tbody>

</table>

</div>

</div>

)

}