export default function Page(){

const calls=[

{
customer:"John",
sentiment:"Positive",
summary:"Interested in roof replacement"
},

{
customer:"Mike",
sentiment:"Neutral",
summary:"Needs estimate"
}

]

return(

<div className="space-y-8">

<h1 className="text-5xl font-bold">

AI Call Analysis

</h1>

{

calls.map((call,i)=>(

<div

key={i}

className="bg-white rounded-3xl p-8 border"

>

<div className="flex justify-between">

<h2 className="text-2xl font-bold">

{call.customer}

</h2>

<span className="bg-slate-100 px-4 py-2 rounded-full">

{call.sentiment}

</span>

</div>

<p className="mt-5">

{call.summary}

</p>

</div>

))

}

</div>

)

}