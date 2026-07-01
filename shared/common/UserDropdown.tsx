"use client"

import Link from "next/link"

import {
    useEffect,
    useRef,
    useState
} from "react"

import {
    getSession,
    signOut
} from "next-auth/react"

import {
    useRouter
} from "next/navigation"

import clsx from "clsx"

import {

    User,

    CheckSquare,

    Bell,

    Settings,

    LogOut,

    ChevronDown,

    Loader2,

    Shield,

    Crown,

    Briefcase,

    Wrench,

    UserCog

} from "lucide-react"

export interface DropdownUser{

    id?:string

    name?:string

    email?:string

    image?:string

    role?:string

}

interface Props {
    open:boolean
    setOpen:(open:boolean)=>void
    user?:DropdownUser

    basePath?:string
}

const ROLE_LABELS:Record<string,string>={

    super_admin:"Super Admin",

    owner:"Owner",

    manager:"Manager",

    sales:"Sales",

    technician:"Technician",

    accountant:"Accountant",

    support:"Support",

    data_entry:"Data Entry"

}

function RoleIcon({

    role

}:{

    role?:string

}){

    switch(role){

        case "super_admin":

            return <Crown size={14}/>

        case "owner":

            return <Shield size={14}/>

        case "manager":

            return <UserCog size={14}/>

        case "technician":

            return <Wrench size={14}/>

        case "sales":

            return <Briefcase size={14}/>

        default:

            return <User size={14}/>

    }

}

export default function UserDropdown({

    open,

    setOpen,

    user:userProp,

    basePath=""

}:Props){

    const router=

    useRouter()

    const ref=

    useRef<HTMLDivElement>(null)

    const [

        loading,

        setLoading

    ]=

    useState(false)

    const [

        user,

        setUser

    ]=

    useState<DropdownUser>(

        userProp ?? {}

    )
        useEffect(()=>{

        async function loadUser(){

            if(userProp){

                setUser(userProp)

                return

            }

            setLoading(true)

            try{

                const session=

                await getSession()

                if(session?.user){

                    setUser({

                        id:(session.user as any).id,

                        name:(session.user as any).name,

                        email:session.user.email ?? "",

                        image:(session.user as any).image,

                        role:(session.user as any).role

                    })

                }

            }finally{

                setLoading(false)

            }

        }

        loadUser()

    },[userProp])



    useEffect(()=>{

        function outside(

            e:MouseEvent

        ){

            if(

                ref.current &&

                !ref.current.contains(

                    e.target as Node

                )

            ){

                setOpen(false)

            }

        }

        document.addEventListener(

            "mousedown",

            outside

        )

        return()=>{

            document.removeEventListener(

                "mousedown",

                outside

            )

        }

    },[setOpen])



    useEffect(()=>{

        function escape(

            e:KeyboardEvent

        ){

            if(

                e.key==="Escape"

            ){

                setOpen(false)

            }

        }

        window.addEventListener(

            "keydown",

            escape

        )

        return()=>{

            window.removeEventListener(

                "keydown",

                escape

            )

        }

    },[setOpen])



    async function logout(){

        setOpen(false)

        await signOut({

            redirect:false

        })

        router.replace("/login")

        router.refresh()

    }



    function initials(){

        if(user.name){

            return user.name

                .split(" ")

                .map(x=>x[0])

                .join("")

                .substring(0,2)

                .toUpperCase()

        }

        return "U"

    }



    if(!open){

        return null

    }

    return(

        <div

            ref={ref}

            className="
            absolute
            right-0
            top-14
            w-[320px]
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-2xl
            z-[200]
            dark:bg-slate-900
            dark:border-slate-800
            "
        >
                    {

                loading

                ?

                (

                    <div
                        className="
                        flex
                        items-center
                        justify-center
                        py-12
                        "
                    >

                        <Loader2
                            size={28}
                            className="animate-spin text-orange-600"
                        />

                    </div>

                )

                :

                (

                    <>

                        {/* -------------------------------------------------- */}
                        {/* User Header */}
                        {/* -------------------------------------------------- */}

                        <div
                            className="
                            border-b
                            border-slate-200
                            p-6
                            dark:border-slate-800
                            "
                        >

                            <div
                                className="
                                flex
                                items-center
                                gap-4
                                "
                            >

                                {

                                    user.image

                                    ?

                                    (

                                        <img

                                            src={user.image}

                                            alt={user.name ?? "User"}

                                            className="
                                            h-14
                                            w-14
                                            rounded-full
                                            object-cover
                                            border
                                            border-slate-200
                                            "

                                        />

                                    )

                                    :

                                    (

                                        <div
                                            className="
                                            flex
                                            h-14
                                            w-14
                                            items-center
                                            justify-center
                                            rounded-full
                                            bg-orange-600
                                            text-lg
                                            font-bold
                                            text-white
                                            "
                                        >

                                            {initials()}

                                        </div>

                                    )

                                }

                                <div
                                    className="
                                    min-w-0
                                    flex-1
                                    "
                                >

                                    <h3
                                        className="
                                        truncate
                                        text-lg
                                        font-semibold
                                        text-slate-900
                                        dark:text-white
                                        "
                                    >

                                        {user.name ?? "User"}

                                    </h3>

                                    <p
                                        className="
                                        truncate
                                        text-sm
                                        text-slate-500
                                        "
                                    >

                                        {user.email}

                                    </p>

                                    <div
                                        className="
                                        mt-3
                                        inline-flex
                                        items-center
                                        gap-2
                                        rounded-full
                                        bg-orange-100
                                        px-3
                                        py-1
                                        text-xs
                                        font-semibold
                                        text-orange-700
                                        dark:bg-orange-950
                                        dark:text-orange-300
                                        "
                                    >

                                        <RoleIcon
                                            role={user.role}
                                        />

                                        {

                                            ROLE_LABELS[
                                                user.role ?? ""
                                            ]

                                            ??

                                            "User"

                                        }

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* -------------------------------------------------- */}
                        {/* Menu */}
                        {/* -------------------------------------------------- */}

                        <div
                            className="
                            py-2
                            "
                        ></div>
                                                    <Link

                                href={`${basePath}/profile`}

                                onClick={()=>setOpen(false)}

                                className="
                                flex
                                items-center
                                gap-3
                                px-6
                                py-3
                                transition
                                hover:bg-slate-50
                                dark:hover:bg-slate-800
                                "

                            >

                                <User
                                    size={18}
                                />

                                <span
                                    className="flex-1"
                                >

                                    Profile

                                </span>

                            </Link>



                            <Link

                                href={`${basePath}/tasks`}

                                onClick={()=>setOpen(false)}

                                className="
                                flex
                                items-center
                                gap-3
                                px-6
                                py-3
                                transition
                                hover:bg-slate-50
                                dark:hover:bg-slate-800
                                "

                            >

                                <CheckSquare
                                    size={18}
                                />

                                <span
                                    className="flex-1"
                                >

                                    My Tasks

                                </span>

                            </Link>



                            <Link

                                href="/notifications"

                                onClick={()=>setOpen(false)}

                                className="
                                flex
                                items-center
                                gap-3
                                px-6
                                py-3
                                transition
                                hover:bg-slate-50
                                dark:hover:bg-slate-800
                                "

                            >

                                <Bell
                                    size={18}
                                />

                                <span
                                    className="flex-1"
                                >

                                    Notifications

                                </span>

                            </Link>



                            <Link

                                href="/settings"

                                onClick={()=>setOpen(false)}

                                className="
                                flex
                                items-center
                                gap-3
                                px-6
                                py-3
                                transition
                                hover:bg-slate-50
                                dark:hover:bg-slate-800
                                "

                            >

                                <Settings
                                    size={18}
                                />

                                <span
                                    className="flex-1"
                                >

                                    Settings

                                </span>

                            </Link>

                        

                        <div
                            className="
                            border-t
                            border-slate-200
                            dark:border-slate-800
                            "
                        >
                                                    <button

                                onClick={logout}

                                className="
                                flex
                                w-full
                                items-center
                                gap-3
                                px-6
                                py-4
                                text-red-600
                                transition
                                hover:bg-red-50
                                dark:hover:bg-red-950/40
                                "

                            >

                                <LogOut
                                    size={18}
                                />

                                <span
                                    className="flex-1 text-left"
                                >

                                    Logout

                                </span>

                            </button>

                        </div>

                    </>

                )

            }

        </div>

    )

}