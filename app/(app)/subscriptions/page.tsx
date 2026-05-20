export default function Subscriptions(){

return(

<div className="grid grid-cols-3 gap-6">

{

["Starter","Pro","Enterprise"]

.map(

x=>(

<div
key={x}
className="bg-white rounded-xl p-8">

<h2 className="text-xl">

{x}

</h2>

<button className="mt-6 bg-blue-600 text-white px-4 py-2 rounded">

Choose

</button>

</div>

)

)

}

</div>

)

}