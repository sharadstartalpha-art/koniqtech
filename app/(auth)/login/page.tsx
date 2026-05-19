import LoginForm

from "@/modules/auth/components/LoginForm"

export default function Page(){

return(

<div className="min-h-screen grid lg:grid-cols-2">

<div className="bg-slate-950 text-white p-16">

<h1 className="text-6xl font-bold">

KONIQ CRM

</h1>

<p className="mt-8">

AI CRM Platform

</p>

</div>

<div className="flex items-center justify-center">

<LoginForm/>

</div>

</div>

)

}