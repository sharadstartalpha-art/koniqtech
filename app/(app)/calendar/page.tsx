export default function Calendar(){

return(

<div className="bg-white rounded-3xl border p-8 h-[700px]">

<h1 className="text-3xl mb-8">

Appointments Calendar

</h1>

<div className="grid grid-cols-7 gap-4">

{

Array

.from({

length:35

})

.map(

(_,i)=>(

<div

key={i}

className="border rounded-xl h-24"

>

{i+1}

</div>

)

)

}

</div>

</div>

)

}