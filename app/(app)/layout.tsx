import Link from "next/link"

export default function AppLayout({
children
}:{
children:React.ReactNode
}){

return(

<div className="min-h-screen flex bg-slate-100">

<aside className="w-72 bg-slate-950 text-white flex flex-col">

<div className="p-6 border-b border-slate-800">

<img
src="/logo.png"
className="h-14 object-contain"
/>

<p className="text-xs text-slate-400 mt-2">

AI Service Platform

</p>

</div>

<nav className="flex-1 p-6 space-y-3">

<Menu href="/dashboard" label="Dashboard"/>

<Menu href="/leads" label="Leads"/>

<Menu href="/customers" label="Customers"/>

<Menu href="/pipeline" label="Pipeline"/>

<Menu href="/jobs" label="Jobs"/>

<Menu href="/calendar" label="Calendar"/>

<Menu href="/messages" label="Messages"/>

<Menu href="/quotes" label="Quotes"/>

<Menu href="/documents" label="Documents"/>

<Menu href="/reports" label="Reports"/>

<Menu href="/settings" label="Settings"/>

</nav>

<div className="p-6 border-t border-slate-800">

<form action="/api/auth/logout" method="POST">

<button className="w-full bg-red-600 rounded-xl p-3">

Logout

</button>

</form>

</div>

</aside>

<div className="flex-1">

<header className="bg-white h-20 border-b px-10 flex items-center justify-between">

<div>

<h2 className="text-2xl font-bold">

Dashboard

</h2>

</div>

<div className="flex gap-4 items-center">

<div className="bg-slate-200 w-10 h-10 rounded-full"/>

<div>

<p className="font-semibold">

Koniq Admin

</p>

<p className="text-sm text-slate-500">

Owner

</p>

</div>

</div>

</header>

<main className="p-10">

{children}

</main>

</div>

</div>

)

}

function Menu({

href,
label

}:{

href:string
label:string

}){

return(

<Link

href={href}

className="block p-4 rounded-xl hover:bg-slate-800"

>

{label}

</Link>

)

}