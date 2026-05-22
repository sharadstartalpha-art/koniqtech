export default function Page(){

const payments=[

{
id:"PAY-1001",
customer:"John Smith",
amount:"$199",
status:"Paid"
},

{
id:"PAY-1002",
customer:"Mike Home",
amount:"$420",
status:"Pending"
}

]

return(

<div>

<h1 className="text-5xl font-bold mb-8">

Payments

</h1>

<div className="space-y-6">

{

payments.map(

p=>(

<div

key={p.id}

className="bg-white rounded-3xl p-8 flex justify-between"

>

<div>

<h2 className="font-bold">

{p.id}

</h2>

<p>

{p.customer}

</p>

</div>

<div>

<p>

{p.amount}

</p>

<p>

{p.status}

</p>

</div>

</div>

)

)

}

</div>

</div>

)

}