"use client"

import {

Calendar,

momentLocalizer

}

from
"react-big-calendar"

import moment
from "moment"

import
"react-big-calendar/lib/css/react-big-calendar.css"

const localizer=

momentLocalizer(
moment
)

export default function CalendarView(){

return(

<div
className=
"h-screen">

<Calendar

localizer=
{localizer}

events={[]}

startAccessor=
"start"

endAccessor=
"end"

/>

</div>

)

}