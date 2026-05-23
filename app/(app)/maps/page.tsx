"use client"

import {

GoogleMap,
LoadScript

}

from "@react-google-maps/api"

export default function Page(){

return(

<LoadScript
googleMapsApiKey={
process.env.NEXT_PUBLIC_MAPS!
}
>

<GoogleMap

mapContainerStyle={{

height:"700px",
width:"100%"

}}

center={{

lat:40,
lng:-74

}}

zoom={10}

/>

</LoadScript>

)

}