import{

NextResponse

}

from "next/server"

export async function GET(){

return NextResponse.json([

"Pipe",
"Roof Tile"

])

}