export default function Page(){

const steps=[
"Create Org",
"Invite Team",
"Branding",
"Integrations",
"Billing"
]

return(

<div className="space-y-6">

<h1 className="text-5xl">
Onboarding
</h1>

{steps.map(s=>(

<div
key={s}
className="
bg-white
border
rounded-xl
p-6
"
>

{s}

</div>

))}

</div>

)

}