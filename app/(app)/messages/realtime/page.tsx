export default function Page(){

return(

<div className="grid grid-cols-3 gap-8">

<div className="bg-white rounded-3xl p-8">

<h2 className="font-bold mb-6">

Chats

</h2>

<div className="space-y-4">

<div className="bg-slate-100 p-4 rounded-xl">

Mike

</div>

<div className="bg-slate-100 p-4 rounded-xl">

John

</div>

</div>

</div>

<div className="col-span-2 bg-white rounded-3xl p-8">

<div className="h-[600px] bg-slate-100 rounded-3xl p-8">

Realtime messages

</div>

</div>

</div>

)

}