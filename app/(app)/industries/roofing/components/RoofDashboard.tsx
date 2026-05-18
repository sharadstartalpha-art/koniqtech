import RoofEstimate from "./RoofEstimate"
import RoofMeasurement from "./RoofMeasurements"

export default function RoofDashboard(){

return(

<div className="p-8 space-y-8">

<h1 className="text-4xl font-bold">

Roofing CRM

</h1>

<RoofEstimate/>

<RoofMeasurement/>

</div>

)

}