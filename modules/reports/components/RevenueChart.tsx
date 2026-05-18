"use client"

import {

LineChart,

Line,

XAxis,

YAxis

}

from
"recharts"

const data=[

{

month:"Jan",

revenue:12000

},

{

month:"Feb",

revenue:19000

}

]

export default function Revenue(){

return(

<LineChart

width={600}

height={300}

data={data}

>

<XAxis
dataKey=
"month"

/>

<YAxis/>

<Line
dataKey=
"revenue"

/>

</LineChart>

)

}