"use client"

import Sidebar from "./Sidebar"
import Topbar from "./Topbar"

export default function AppShell({
children
}:{
children:React.ReactNode
}){

return(

<div className="min-h-screen flex bg-slate-50">

<Sidebar/>

<div className="flex-1">

<Topbar/>

<main className="p-8">

{children}

</main>

</div>

</div>

)

}