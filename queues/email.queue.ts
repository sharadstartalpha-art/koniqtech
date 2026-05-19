import {Queue}

from "bullmq"

import {redis}

from "./connection"

export const emailQueue=

new Queue(

"email",

{

connection:

redis

}

)