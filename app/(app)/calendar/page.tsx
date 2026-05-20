export default function Calendar(){

return(

<div className="bg-white rounded-xl p-6">

<h1 className="text-2xl mb-6">

Calendar

</h1>

<div className="grid grid-cols-7 gap-2">

{

Array.from({

length:35

}).map((_,i)=>(

<div
key={i}
className="border h-24 rounded-lg p-2">

{i+1}

</div>

))

}

</div>

</div>

)

}