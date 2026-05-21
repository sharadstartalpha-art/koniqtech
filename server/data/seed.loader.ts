import prisma from "@/shared/lib/prisma"

export async function loadProductionData(){

await prisma.organization.upsert({

where:{

slug:"koniq"

},

update:{},

create:{

name:"KONIQ",

slug:"koniq"

}

})

console.log(

"production loaded"

)

}