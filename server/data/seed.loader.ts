import prisma from "@/shared/lib/prisma"

import { CRMType } from "@prisma/client"

export async function loadProductionData(){

await prisma.organization.upsert({

where:{

slug:

"koniq"

},

update:{},

create:{

name:

"KONIQ",

slug:

"koniq",

crmType:

CRMType.roofing,

industry:

"roofing",

plan:

"enterprise",

email:

"admin@koniqtech.com"

}

})

console.log(

"production loaded"

)

}