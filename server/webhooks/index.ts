export async function sendWebhook(

url:string,

payload:any

){

await fetch(

url,

{

method:"POST",

headers:{

"Content-Type":

"application/json"

},

body:

JSON.stringify(

payload

)

}

)

}