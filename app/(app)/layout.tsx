import Sidebar from
"@/shared/components/layout/Sidebar"

import Topbar from
"@/shared/components/layout/Topbar"

export default function Layout({

children

}:any){

return(

<div className="flex">

<Sidebar/>

<div className="flex-1">

<Topbar/>

{children}

</div>

</div>

)

}