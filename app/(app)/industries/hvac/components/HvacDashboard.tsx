import UnitManager from "./UnitManager"
import MaintenanceBoard from "./MaintenanceBoard"

export default function HvacDashboard(){

return(

<div className="p-8 space-y-8">

<h1 className="text-4xl font-bold">

HVAC CRM

</h1>

<UnitManager/>

<MaintenanceBoard/>

</div>

)

}