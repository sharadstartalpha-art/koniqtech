export default function Page(){

return(

<div>

<h1 className="text-5xl font-bold mb-8">

Live Tracking

</h1>

<div className="grid grid-cols-3 gap-8">

<div className="col-span-2 bg-white rounded-3xl p-10">

<div className="h-[600px] bg-slate-100 rounded-3xl flex items-center justify-center">

MAP

</div>

</div>

<div className="bg-white rounded-3xl p-8">

<h2 className="font-bold mb-6">

Technicians

</h2>

<div className="space-y-4">

<div className="bg-slate-100 p-4 rounded-xl">

Mike • Active

</div>

<div className="bg-slate-100 p-4 rounded-xl">

John • En Route

</div>

</div>

</div>

</div>

</div>

)

}