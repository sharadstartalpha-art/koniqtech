"use client"

import dynamic from "next/dynamic"

const Map=dynamic(

()=>import("./map"),

{
ssr:false
}

)

export default function GPSPage(){

return(

<div className="space-y-6">

<h1 className="text-2xl font-semibold">

Live GPS

</h1>

<Map/>

</div>

)

}