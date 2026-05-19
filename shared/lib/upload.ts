import {

PutObjectCommand

}

from

"@aws-sdk/client-s3"

import {s3}

from "./storage"

export async function upload(

key:string

){

await s3.send(

new PutObjectCommand({

Bucket:

process.env.AWS_BUCKET,

Key:key

})

)

}