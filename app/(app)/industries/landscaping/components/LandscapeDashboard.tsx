import ProjectBoard from "./ProjectBoard"
import SeasonPlanner from "./SeasonPlanner"

export default function LandscapeDashboard(){

return(

<div className="p-8 space-y-8">

<h1 className="text-4xl font-bold">

Landscaping CRM

</h1>

<ProjectBoard/>

<SeasonPlanner/>

</div>

)

}