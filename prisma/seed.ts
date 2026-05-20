import {
PrismaClient,
Industry,
UserRole,
SubscriptionStatus
}

from "@prisma/client"

import bcrypt from "bcryptjs"

const prisma=
new PrismaClient()

async function main(){

const passwordHash=

await bcrypt.hash(

"admin123",

10

)

/*
ORG
*/

let org=

await prisma.organization.findUnique({

where:{

slug:
"elite-roofing-us"

}

})

if(!org){

org=

await prisma.organization.create({

data:{

name:
"Elite Roofing Solutions",

slug:
"elite-roofing-us",

industry:
Industry.roofing,

plan:
"pro",

email:
"admin@eliteroofingusa.com",

phone:
"+1-469-555-1000",

address:
"Dallas Texas USA"

}

})

}

/*
ADMIN
*/

await prisma.user.upsert({

where:{

email:
"admin@koniqtech.com"

},

update:{

passwordHash,

orgId:
org.id

},

create:{

name:
"Koniq Admin",

email:
"admin@koniqtech.com",

passwordHash,

role:
UserRole.owner,

orgId:
org.id

}

})

/*
SALES
*/

await prisma.user.upsert({

where:{

email:
"sales@eliteroofingusa.com"

},

update:{},

create:{

name:
"Sarah Williams",

email:
"sales@eliteroofingusa.com",

passwordHash,

role:
UserRole.sales,

orgId:
org.id

}

})

/*
TECH
*/

await prisma.user.upsert({

where:{

email:
"tech@eliteroofingusa.com"

},

update:{},

create:{

name:
"David Wilson",

email:
"tech@eliteroofingusa.com",

passwordHash,

role:
UserRole.technician,

orgId:
org.id

}

})

/*
SETTINGS
*/

const settings=

await prisma.organizationSettings.findUnique({

where:{

orgId:
org.id

}

})

if(!settings){

await prisma.organizationSettings.create({

data:{

orgId:
org.id,

timezone:
"America/Chicago",

currency:
"USD"

}

})

}

/*
PAYPAL SUB
*/

const sub=

await prisma.subscription.findFirst({

where:{

externalId:
"PAYPAL-SUB-US-10001"

}

})

if(!sub){

await prisma.subscription.create({

data:{

orgId:
org.id,

provider:
"paypal",

externalId:
"PAYPAL-SUB-US-10001",

plan:
"pro",

status:
SubscriptionStatus.active

}

})

}

console.log(
"SEED OK"
)

}

main()

.then(async()=>{

await prisma.$disconnect()

})

.catch(async(e)=>{

console.error(e)

await prisma.$disconnect()

process.exit(1)

})