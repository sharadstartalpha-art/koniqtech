export default function Customers(){

return(

<div className="space-y-8">

<h1 className="text-4xl font-bold text-slate-900">

Customers

</h1>

<div className="grid grid-cols-3 gap-6">

<Card t="Total" v="112"/>

<Card t="Active" v="89"/>

<Card t="VIP" v="23"/>

</div>

<div className="bg-white rounded-3xl p-8 shadow">

Customer Grid

</div>

</div>

)

}

function Card({t,v}:any){

return(

<div className="bg-white p-8 rounded-3xl">

<p>{t}</p>

<h2 className="text-4xl">

{v}

</h2>

</div>

)

}