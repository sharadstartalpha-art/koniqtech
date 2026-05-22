export default function Page(){

return(

<div>

<h1 className="text-5xl font-bold mb-8">

Route Planner

</h1>

<div className="grid grid-cols-2 gap-8">

<div className="bg-white rounded-3xl p-8">

<h2 className="font-bold mb-6">

Stops

</h2>

<div className="space-y-4">

<div className="bg-slate-100 p-4 rounded-xl">

Stop 1

</div>

<div className="bg-slate-100 p-4 rounded-xl">

Stop 2

</div>

<div className="bg-slate-100 p-4 rounded-xl">

Stop 3

</div>

</div>

</div>

<div className="bg-white rounded-3xl p-8">

<div className="h-[500px] bg-slate-100 rounded-3xl flex items-center justify-center">

MAP

</div>

</div>

</div>

</div>

)

}