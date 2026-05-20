export function hasPermission(

role:string,
permission:string

){

const map={

owner:[

"*"

],

manager:[

"lead",

"job"

],

tech:[

"job"

]

}

return (

map[
role as keyof typeof map
]

||[]

)

.includes(permission)

}