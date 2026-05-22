export default function Page(){

return(

<div className="
min-h-screen

bg-slate-50

flex
items-center
justify-center
">

<div className="
w-full

max-w-[520px]

bg-white

border

rounded-[32px]

p-12
">

<h1 className="
text-4xl

font-semibold
">

Forgot password

</h1>

<p className="
text-slate-500

mt-3
">

Enter your email to receive reset link

</p>

<div className="
mt-8

space-y-5
">

<input

placeholder="Email"

className="
w-full

h-14

px-5

rounded-2xl

border

bg-slate-50
"

/>

<button

className="
w-full

h-14

bg-black

text-white

rounded-2xl
"

>

Send reset link

</button>

</div>

</div>

</div>

)

}