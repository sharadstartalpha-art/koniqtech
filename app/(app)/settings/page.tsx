import Link from
"next/link"

export default function Settings(){

return(

<div className="p-10">

<h1>

Settings

</h1>

<div className="mt-5">

<Link
href="/settings/profile">

Profile

</Link>

</div>

</div>

)

}