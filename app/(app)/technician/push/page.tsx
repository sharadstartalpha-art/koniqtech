"use client"

export default function Page(){

async function notify(){

new Notification(

"New Job Assigned"

)

}

return(

<button
onClick={notify}
>

Notify

</button>

)

}