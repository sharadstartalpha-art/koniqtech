import prisma from "@/shared/lib/prisma"

export default async function Page(){

const tasks=

await prisma.jobTask.findMany({

where:{

dependsOnId:{

not:null

}

}

})

return(

<div>

<h1 className="text-4xl font-semibold mb-6">

Dependencies

</h1>

<pre>

{

JSON.stringify(
tasks,
null,
2
)

}

</pre>

</div>

)

}