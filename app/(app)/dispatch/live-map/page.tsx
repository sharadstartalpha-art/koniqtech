"use client"

import dynamic from "next/dynamic"

const Map=dynamic(

()=>import("../gps/map"),

{
ssr:false
}

)

export default function LiveMap(){

return(

<div className="bg-white rounded-xl p-6">

<h1 className="text-xl font-semibold mb-6">

Technician Tracking

</h1>

<Map/>

</div>

)

}