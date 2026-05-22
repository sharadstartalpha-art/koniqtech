import "next-auth"

declare module "next-auth"{

interface Session{

user:{

id:string

orgId:string

role:string

email:string

name:string

}

}

}