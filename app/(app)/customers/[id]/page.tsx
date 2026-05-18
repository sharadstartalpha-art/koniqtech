import CustomerProfile
from "@/modules/customers/components/CustomerProfile"

export default async function Page({

params

}:{

params:
Promise<{
id:string
}>

}){

const {id}=await params

return(

<CustomerProfile

id={id}

/>

)

}