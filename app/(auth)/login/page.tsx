export default function Login(){

return(

<div className="
min-h-screen
flex
items-center
justify-center
bg-slate-100
">

<div className="
bg-white
w-[500px]
rounded-3xl
shadow-xl
p-10
space-y-6
">

<h1 className="
text-4xl
font-bold
">

Login

</h1>

<form className="space-y-4">

<input
placeholder="Email"
className="
w-full
border
rounded-xl
p-4
"
/>

<input
type="password"
placeholder="Password"
className="
w-full
border
rounded-xl
p-4
"
/>

<button
className="
w-full
bg-blue-600
text-white
rounded-xl
p-4
"
>

Sign In

</button>

</form>

</div>

</div>

)

}