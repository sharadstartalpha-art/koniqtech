const cache=
new Map()

export async function GET(){

return Response.json(

Array.from(

cache.entries()

)

)

}

export async function POST(
req:Request
){

const body=
await req.json()

cache.set(

body.key,

body.value

)

return Response.json({

ok:true

})

}