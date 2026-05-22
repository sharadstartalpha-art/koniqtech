import {

test,

expect

}

from "@playwright/test"

test(

"login page",

async({

page

}:any)=>{

await page.goto("/login")

await expect(

page

).toHaveTitle(

/koniq/i

)

}

)