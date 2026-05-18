import AssetManager from "./AssetManager"
import ServiceHistory from "./ServiceHistory"

export default function PlumbingDashboard(){

return(

<div className="p-8 space-y-8">

<h1 className="text-4xl font-bold">

Plumbing CRM

</h1>

<AssetManager/>

<ServiceHistory/>

</div>

)

}