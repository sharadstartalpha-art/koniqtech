export default function Page(){

return(

<div>

<h1 className="text-5xl font-bold mb-8">

Calendar

</h1>

<div className="bg-white rounded-3xl h-[700px] p-8">

<div className="grid grid-cols-7 gap-4">

{

Array.from({

length:35

}).map((_,i)=>(

<div

key={i}

className="border h-32 rounded-xl p-3"

>

{i+1}

</div>

))

}

</div>

</div>

</div>

)

}