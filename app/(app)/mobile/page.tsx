export default function Page(){

return(

<div className="space-y-8">

<h1 className="text-5xl font-bold">

Mobile App

</h1>

<div className="grid grid-cols-2 gap-8">

<div className="bg-white rounded-3xl p-8">

<h2 className="text-2xl font-bold">

Technician App

</h2>

<ul className="mt-6 space-y-3">

<li>GPS Tracking</li>

<li>Photo Upload</li>

<li>Offline Sync</li>

<li>Signatures</li>

</ul>

</div>

<div className="bg-white rounded-3xl p-8">

<h2 className="text-2xl font-bold">

Customer App

</h2>

<ul className="mt-6 space-y-3">

<li>Invoices</li>

<li>Appointments</li>

<li>Quotes</li>

<li>Payments</li>

</ul>

</div>

</div>

</div>

)

}