"use client"

import {
LineChart,
Line,
XAxis,
YAxis
}
from "recharts"

const data=[

{
m:"Jan",
v:12000
},

{
m:"Feb",
v:18000
},

{
m:"Mar",
v:32000
}

]

export default function RevenueChart(){

return(

<LineChart
width={700}
height={300}
data={data}
>

<XAxis dataKey="m"/>

<YAxis/>

<Line dataKey="v"/>

</LineChart>

)

}