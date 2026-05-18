"use client"

import {useState}
from "react"

import {
createLead
}

from
"@/modules/leads/actions/createLead.action"

export default function NewLead(){

const[
name,
setName
]=useState("")

async function save(){

await createLead({

firstName:name,

orgId:
"ADD_ORG"

})

}

return(

<div className="p-10">

<input

className="border p-3"

onChange={e=>

setName(
e.target.value
)

}

/>

<button
onClick={save}

className="border p-3">

Save

</button>

</div>

)

}