"use client"

import {
createContext,
useContext
}

from "react"

const TenantContext=
createContext<any>(
null
)

export function TenantProvider({

children,

tenant

}:any){

return(

<TenantContext.Provider
value={tenant}>

{children}

</TenantContext.Provider>

)

}

export function useTenant(){

return useContext(
TenantContext
)

}