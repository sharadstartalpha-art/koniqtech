export async function GET(){

return Response.json({

roles:[

"SUPER_ADMIN",
"OWNER",
"SALES",
"TECHNICIAN"

]

})

}