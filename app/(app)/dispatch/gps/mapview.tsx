"use client"

import dynamic from "next/dynamic"

const Map=

dynamic(

async()=>{

const leaflet=

await import(

"react-leaflet"

)

return function LeafletMap(){

const {

MapContainer,
TileLayer,
Marker

}=leaflet as any

return(

<MapContainer

center={[40,74]}

zoom={8}

style={{

height:"700px",
width:"100%"

}}

>

<TileLayer

url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

/>

<Marker

position={[40,74]}

/>

</MapContainer>

)

}

},

{

ssr:false

}

)

export default function MapView(){

return <Map/>

}