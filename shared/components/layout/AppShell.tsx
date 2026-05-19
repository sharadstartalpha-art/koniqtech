"use client"

import Sidebar from "./Sidebar"
import Topbar from "./Topbar"
import MobileShell from "./MobileShell"

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
<MobileShell/>
</main>

</div>

</div>

)

}