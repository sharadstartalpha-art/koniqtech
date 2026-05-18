export default function CustomerProfile({

id

}:{

id:string

}){

return(

<div className="
p-8
space-y-6
">

<h1 className="
text-4xl
font-bold
">

Customer

</h1>

<div className="
bg-white
border
rounded-xl
p-6
">

Customer ID:

{id}

</div>

</div>

)

}