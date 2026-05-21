const tests=[

"register",

"login",

"logout",

"otp",

"lead crud",

"job crud",

"dispatch",

"billing",

"ai",

"voice",

"mobile"

]

export default function QA(){

return(

<div className="
bg-white
rounded-xl
p-8
">

<h1 className="
text-2xl
font-bold
mb-8
">

Manual QA

</h1>

<div className="
space-y-3
">

{

tests.map(

t=>(

<div

key={t}

className="
border
p-4
rounded-xl
flex
justify-between
"

>

{t}

<input

type="checkbox"

/>

</div>

)

)

}

</div>

</div>

)

}