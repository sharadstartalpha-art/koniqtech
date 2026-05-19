import Link from "next/link"

export default function AppLayout({
children
}:{
children:React.ReactNode
}){

return(

<div className="min-h-screen bg-slate-50">

<div className="flex">

<aside className="
w-72
bg-slate-950
text-white
min-h-screen
p-6
">

<h1 className="
text-3xl
font-bold
mb-10
">

KONIQ CRM

</h1>

<nav className="
space-y-3
text-sm
">

<Link href="/dashboard" className="block">Dashboard</Link>
<Link href="/leads" className="block">Leads</Link>
<Link href="/customers" className="block">Customers</Link>
<Link href="/pipeline" className="block">Pipeline</Link>
<Link href="/jobs" className="block">Jobs</Link>
<Link href="/calendar" className="block">Calendar</Link>
<Link href="/messages" className="block">Messages</Link>
<Link href="/quotes" className="block">Quotes</Link>
<Link href="/documents" className="block">Documents</Link>
<Link href="/reports" className="block">Reports</Link>
<Link href="/settings" className="block">Settings</Link>

</nav>

</aside>

<main className="
flex-1
p-10
">

{children}

</main>

</div>

</div>

)

}