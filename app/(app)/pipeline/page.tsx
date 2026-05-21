const cols=[

"New",

"Contacted",

"Estimate",

"Won",

"Lost"

]

export default function Pipeline(){

return(

<div>

<h1 className="text-3xl font-bold mb-8">

Sales Pipeline

</h1>

<div className="grid grid-cols-5 gap-6">

{

cols.map(

c=>(

<div

key={c}

className="bg-white rounded-3xl border p-6"

>

<h2 className="font-semibold mb-6">

{c}

</h2>

<div className="bg-slate-50 rounded-xl p-4">

Lead Card

</div>

</div>

)

)

}

</div>

</div>

)

}