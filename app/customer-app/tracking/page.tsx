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
process.env
.NEXT_PUBLIC_MAPS!
}

>

<GoogleMap

zoom={10}

center={

{
lat:40,
lng:-74
}

}

mapContainerStyle={

{
height:"600px"
}

}

/>

</LoadScript>

)

}