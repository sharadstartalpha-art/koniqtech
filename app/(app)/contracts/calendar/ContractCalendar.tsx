"use client"

import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"

export default function ContractCalendar({

  events

}:{

  events:any[]

}){

  return(

    <FullCalendar

      plugins={[

        dayGridPlugin,
        interactionPlugin

      ]}

      initialView="dayGridMonth"

      height="auto"

      events={events}

      eventClick={(info)=>{

        info.jsEvent.preventDefault()

        if(info.event.url){

          window.location.href=
            info.event.url

        }

      }}

    />

  )

}