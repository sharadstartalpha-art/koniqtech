export default function FileVault(){

const files=[

"Roof Quote.pdf",

"Permit.pdf",

"Invoice-1001.pdf",

"Inspection.jpg"

]

return(

<div className="
p-8
space-y-6
">

<h1 className="
text-4xl
font-bold
">

File Vault

</h1>

<div className="
grid
gap-4
">

{

files.map(

file=>(

<div

key={file}

className="
bg-white
border
rounded-xl
p-5
"

>

{file}

</div>

)

)

}

</div>

</div>

)

}