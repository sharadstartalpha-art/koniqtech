"use client"

import dynamic from "next/dynamic"

const LeafletMap = dynamic(

() => import("./mapview"),

{
ssr:false
}

)

export default function Map(){

return <LeafletMap/>

}