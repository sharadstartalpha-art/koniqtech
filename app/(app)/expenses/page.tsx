export default function Page(){

const expenses=[

{
name:"Materials",
amount:"$1800"
},

{
name:"Fuel",
amount:"$300"
},

{
name:"Tools",
amount:"$700"
}

]

return(

<div>

<h1 className="text-5xl font-bold mb-8">

Expenses

</h1>

<div className="space-y-6">

{

expenses.map(

e=>(

<div

key={e.name}

className="bg-white rounded-3xl p-8 flex justify-between"

>

<span>

{e.name}

</span>

<b>

{e.amount}

</b>

</div>

)

)

}

</div>

</div>

)

}