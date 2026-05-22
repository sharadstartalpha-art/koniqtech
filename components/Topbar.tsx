import { auth } from "@/auth"

export default async function Topbar(){

const session=

await auth()

return(

<div className="
h-20

bg-white

border-b

px-8

flex
items-center
justify-between
">

<input

placeholder="Search..."

className="
h-11

w-[360px]

bg-[#f5f5f5]

border

rounded-xl

px-4

text-sm

outline-none
"

/>

<div className="
flex
items-center
gap-5
">

<button>

🔔

</button>

<div className="
text-right
">

<p className="
font-medium
text-sm
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