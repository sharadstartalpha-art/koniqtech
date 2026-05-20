"use client"

export default function VoiceRun(){

function start(){

window.alert(

"voice started"

)

}

return(

<div className="bg-white p-6 rounded-xl">

<h1>

Voice AI

</h1>

<button

onClick={start}

className="bg-blue-600 text-white px-4 py-2 rounded mt-6"

>

Start

</button>

</div>

)

}