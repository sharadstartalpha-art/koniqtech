export const ROLES=[

"OWNER",
"ADMIN",
"MANAGER",
"TECHNICIAN",
"SALES",
"CUSTOMER",
"SUPER_ADMIN"

]

export function hasRole(

userRole:string,
allowed:string[]

){

return allowed.includes(userRole)

}