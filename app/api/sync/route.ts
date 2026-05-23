let sync:any[]=[]

export async function GET(){

return Response.json(
sync
)

}

export async function POST(
req:Request
){

sync.push(

await req.json()

)

return Response.json({

ok:true

})

}