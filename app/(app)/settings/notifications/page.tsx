export default function Page(){

const settings=[

"Email Notifications",

"SMS Alerts",

"Invoice Alerts",

"Job Updates",

"AI Notifications"

]

return(

<div>

<h1 className="text-5xl font-bold mb-8">

Notification Settings

</h1>

<div className="bg-white rounded-3xl p-10 space-y-5">

{

settings.map(

s=>(

<label

key={s}

className="flex justify-between border rounded-xl p-5"

>

<span>

{s}

</span>

<input
type="checkbox"
defaultChecked
/>

</label>

)

)

}

</div>

</div>

)

}