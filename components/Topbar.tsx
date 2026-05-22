import { auth } from "@/auth"

export default async function Topbar(){

const session=
await auth()

return(

<div className="
h-20

bg-white

border-b

border-[#e5e7eb]

px-8

flex
items-center
justify-between
">

<input

placeholder="Search..."

className="

w-[420px]

h-11

bg-[#f5f5f5]

border

border-[#e7e7e7]

rounded-2xl

px-5

text-sm

outline-none

"

/>

<div className="
flex
items-center
gap-5
">

<button className="text-xl">

🔔

</button>

<div className="
flex
flex-col
items-end
">

<p className="
text-sm
font-medium
">

{

session?.user?.name

}

</p>

<p className="
text-xs
text-slate-500
">

{

session?.user?.email

}

</p>

</div>

</div>

</div>

)

}