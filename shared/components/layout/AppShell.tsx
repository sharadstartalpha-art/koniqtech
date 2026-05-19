export default function AppShell({

children

}:{

children:React.ReactNode

}){

return(

<div className="min-h-screen flex">

<aside className="
w-72
bg-slate-900
text-white
p-6
">

KONIQ CRM

</aside>

<main className="
flex-1
bg-slate-100
p-8
">

{children}

</main>

</div>

)

}