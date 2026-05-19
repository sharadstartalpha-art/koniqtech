import AppShell
from "@/shared/components/layout/AppShell"

export default function Layout({
children
}:{
children:React.ReactNode
}){

return(

<AppShell>

{children}

</AppShell>

)

}