export default function Page(){

return(

<div>

<h1 className="text-5xl font-bold mb-8">

Photos

</h1>

<div className="
grid
grid-cols-4
gap-6
">

{

Array.from({

length:8

}).map((_,i)=>(

<div

key={i}

className="
aspect-square
bg-white
border
rounded-3xl
"

>

</div>

))

}

</div>

</div>

)

}