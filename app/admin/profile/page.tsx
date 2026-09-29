"use client"

import {
    useEffect,
    useState
} from "react"

import {
    getSession
} from "next-auth/react"

import {
    useRouter
} from "next/navigation"

import {
    User,
    Mail,
    Shield,
    Save,
    Loader2,
    CheckCircle2,
    AlertCircle,
    ArrowLeft
} from "lucide-react"

type ProfileUser = {
    id?: string
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string | null
}

const ROLE_LABELS: Record<string, string> = {
    super_admin: "Super Admin",
    platform_manager: "Platform Manager",
    platform_sales: "Platform Sales",
    support: "Support",
    finance: "Finance",
    developer: "Developer",
    qa: "QA",
    customer_success: "Customer Success",
    marketing: "Marketing",
    data_entry: "Data Entry"
}

export default function AdminProfilePage() {

    const router = useRouter()

    const [user, setUser] = useState<ProfileUser>({})

    const [name, setName] = useState("")

    const [loading, setLoading] = useState(true)

    const [saving, setSaving] = useState(false)

    const [success, setSuccess] = useState("")

    const [error, setError] = useState("")


    /*
    |--------------------------------------------------------------------------
    | Load current session
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        async function loadProfile() {

            try {

                setLoading(true)

                const session = await getSession()

                if (!session?.user) {

                    router.replace("/login")

                    return

                }

                const sessionUser = session.user as any

                const profile: ProfileUser = {

                    id: sessionUser.id,

                    name: sessionUser.name ?? "",

                    email: sessionUser.email ?? "",

                    image: sessionUser.image ?? null,

                    role: sessionUser.role ?? null

                }

                setUser(profile)

                setName(profile.name ?? "")

            } catch {

                setError(
                    "Unable to load your profile."
                )

            } finally {

                setLoading(false)

            }

        }

        loadProfile()

    }, [router])


    /*
    |--------------------------------------------------------------------------
    | Save profile
    |--------------------------------------------------------------------------
    */

    async function handleSave(
        e: React.FormEvent<HTMLFormElement>
    ) {

        e.preventDefault()

        setSuccess("")

        setError("")


        const cleanName = name.trim()

        if (!cleanName) {

            setError(
                "Name is required."
            )

            return

        }


        try {

            setSaving(true)

            const response = await fetch(
                "/api/admin/profile",
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: cleanName
                    })
                }
            )


            const data = await response.json()


            if (!response.ok) {

                throw new Error(
                    data?.error ||
                    "Unable to update profile."
                )

            }


            setUser(previous => ({
                ...previous,
                name: data?.user?.name ?? cleanName
            }))

            setName(
                data?.user?.name ?? cleanName
            )

            setSuccess(
                "Profile updated successfully."
            )

        } catch (err) {

            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to update profile."
            )

        } finally {

            setSaving(false)

        }

    }


    /*
    |--------------------------------------------------------------------------
    | Initials
    |--------------------------------------------------------------------------
    */

    function initials() {

        const value =
            user.name?.trim() ||
            user.email?.trim() ||
            "A"

        return value
            .split(" ")
            .map(part => part.charAt(0))
            .join("")
            .substring(0, 2)
            .toUpperCase()

    }


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (

            <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center">

                <div className="flex items-center gap-3 text-slate-500">

                    <Loader2
                        size={22}
                        className="animate-spin"
                    />

                    <span>
                        Loading profile...
                    </span>

                </div>

            </div>

        )

    }


    /*
    |--------------------------------------------------------------------------
    | Page
    |--------------------------------------------------------------------------
    */

    return (

        <div className="min-h-[calc(100vh-5rem)] bg-slate-50 px-6 py-8 dark:bg-slate-950">

            <div className="mx-auto max-w-4xl">


                {/* --------------------------------------------------------- */}
                {/* Page Header */}
                {/* --------------------------------------------------------- */}

                <div className="mb-8 flex items-center justify-between">

                    <div>

                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="
                                mb-4
                                inline-flex
                                items-center
                                gap-2
                                text-sm
                                font-medium
                                text-slate-500
                                transition
                                hover:text-slate-900
                                dark:hover:text-white
                            "
                        >

                            <ArrowLeft size={16} />

                            Back

                        </button>


                        <h1 className="
                            text-3xl
                            font-bold
                            tracking-tight
                            text-slate-900
                            dark:text-white
                        ">

                            My Profile

                        </h1>


                        <p className="
                            mt-2
                            text-sm
                            text-slate-500
                            dark:text-slate-400
                        ">

                            Manage your administrator profile information.

                        </p>

                    </div>

                </div>


                {/* --------------------------------------------------------- */}
                {/* Alerts */}
                {/* --------------------------------------------------------- */}

                {success && (

                    <div className="
                        mb-6
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        border
                        border-emerald-200
                        bg-emerald-50
                        px-4
                        py-3
                        text-sm
                        text-emerald-700
                        dark:border-emerald-900
                        dark:bg-emerald-950/40
                        dark:text-emerald-300
                    ">

                        <CheckCircle2 size={18} />

                        <span>
                            {success}
                        </span>

                    </div>

                )}


                {error && (

                    <div className="
                        mb-6
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        border
                        border-red-200
                        bg-red-50
                        px-4
                        py-3
                        text-sm
                        text-red-700
                        dark:border-red-900
                        dark:bg-red-950/40
                        dark:text-red-300
                    ">

                        <AlertCircle size={18} />

                        <span>
                            {error}
                        </span>

                    </div>

                )}


                {/* --------------------------------------------------------- */}
                {/* Profile Card */}
                {/* --------------------------------------------------------- */}

                <div className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-sm
                    dark:border-slate-800
                    dark:bg-slate-900
                ">


                    {/* Profile Banner */}

                    <div className="
                        h-32
                        bg-gradient-to-r
                        from-orange-500
                        via-orange-600
                        to-amber-500
                    " />


                    {/* Profile Identity */}

                    <div className="
                        border-b
                        border-slate-200
                        px-8
                        pb-8
                        dark:border-slate-800
                    ">

                        <div className="
                            -mt-12
                            flex
                            items-end
                            gap-5
                        ">


                            {/* Avatar */}

                            {user.image ? (

                                <img
                                    src={user.image}
                                    alt={user.name ?? "Administrator"}
                                    className="
                                        h-24
                                        w-24
                                        rounded-2xl
                                        border-4
                                        border-white
                                        object-cover
                                        shadow-lg
                                        dark:border-slate-900
                                    "
                                />

                            ) : (

                                <div className="
                                    flex
                                    h-24
                                    w-24
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    border-4
                                    border-white
                                    bg-orange-600
                                    text-2xl
                                    font-bold
                                    text-white
                                    shadow-lg
                                    dark:border-slate-900
                                ">

                                    {initials()}

                                </div>

                            )}


                            <div className="pb-1">

                                <h2 className="
                                    text-xl
                                    font-bold
                                    text-slate-900
                                    dark:text-white
                                ">

                                    {user.name || "Administrator"}

                                </h2>

                                <p className="
                                    mt-1
                                    text-sm
                                    text-slate-500
                                ">

                                    {user.email}

                                </p>

                            </div>

                        </div>

                    </div>


                    {/* ----------------------------------------------------- */}
                    {/* Form */}
                    {/* ----------------------------------------------------- */}

                    <form
                        onSubmit={handleSave}
                        className="p-8"
                    >


                        <div className="mb-8">

                            <h3 className="
                                text-lg
                                font-semibold
                                text-slate-900
                                dark:text-white
                            ">

                                Profile Information

                            </h3>

                            <p className="
                                mt-1
                                text-sm
                                text-slate-500
                            ">

                                Update the information associated with your
                                administrator account.

                            </p>

                        </div>


                        <div className="
                            grid
                            gap-6
                            md:grid-cols-2
                        ">


                            {/* Name */}

                            <div>

                                <label
                                    htmlFor="name"
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-medium
                                        text-slate-700
                                        dark:text-slate-300
                                    "
                                >

                                    Full Name

                                </label>


                                <div className="relative">

                                    <User
                                        size={18}
                                        className="
                                            absolute
                                            left-3
                                            top-1/2
                                            -translate-y-1/2
                                            text-slate-400
                                        "
                                    />


                                    <input
                                        id="name"
                                        type="text"
                                        value={name}
                                        onChange={e =>
                                            setName(e.target.value)
                                        }
                                        placeholder="Enter your name"
                                        autoComplete="name"
                                        className="
                                            h-12
                                            w-full
                                            rounded-xl
                                            border
                                            border-slate-200
                                            bg-white
                                            pl-10
                                            pr-4
                                            text-sm
                                            outline-none
                                            transition
                                            focus:border-orange-500
                                            focus:ring-2
                                            focus:ring-orange-500/20
                                            dark:border-slate-700
                                            dark:bg-slate-950
                                            dark:text-white
                                        "
                                    />

                                </div>

                            </div>


                            {/* Email */}

                            <div>

                                <label
                                    htmlFor="email"
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-medium
                                        text-slate-700
                                        dark:text-slate-300
                                    "
                                >

                                    Email Address

                                </label>


                                <div className="relative">

                                    <Mail
                                        size={18}
                                        className="
                                            absolute
                                            left-3
                                            top-1/2
                                            -translate-y-1/2
                                            text-slate-400
                                        "
                                    />


                                    <input
                                        id="email"
                                        type="email"
                                        value={user.email ?? ""}
                                        disabled
                                        className="
                                            h-12
                                            w-full
                                            cursor-not-allowed
                                            rounded-xl
                                            border
                                            border-slate-200
                                            bg-slate-100
                                            pl-10
                                            pr-4
                                            text-sm
                                            text-slate-500
                                            outline-none
                                            dark:border-slate-700
                                            dark:bg-slate-800
                                            dark:text-slate-400
                                        "
                                    />

                                </div>


                                <p className="
                                    mt-2
                                    text-xs
                                    text-slate-400
                                ">

                                    Email address cannot be changed here.

                                </p>

                            </div>


                            {/* Role */}

                            <div>

                                <label
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-medium
                                        text-slate-700
                                        dark:text-slate-300
                                    "
                                >

                                    Administrator Role

                                </label>


                                <div className="
                                    flex
                                    h-12
                                    items-center
                                    gap-3
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-slate-100
                                    px-4
                                    dark:border-slate-700
                                    dark:bg-slate-800
                                ">

                                    <Shield
                                        size={18}
                                        className="text-orange-600"
                                    />


                                    <span className="
                                        text-sm
                                        font-medium
                                        text-slate-700
                                        dark:text-slate-300
                                    ">

                                        {
                                            ROLE_LABELS[
                                                user.role ?? ""
                                            ] ?? "Administrator"
                                        }

                                    </span>

                                </div>


                                <p className="
                                    mt-2
                                    text-xs
                                    text-slate-400
                                ">

                                    Your administrator role is managed by
                                    the platform.

                                </p>

                            </div>


                        </div>


                        {/* ------------------------------------------------- */}
                        {/* Save */}
                        {/* ------------------------------------------------- */}

                        <div className="
                            mt-8
                            flex
                            justify-end
                            border-t
                            border-slate-200
                            pt-6
                            dark:border-slate-800
                        ">

                            <button
                                type="submit"
                                disabled={
                                    saving ||
                                    !name.trim()
                                }
                                className="
                                    inline-flex
                                    h-11
                                    items-center
                                    gap-2
                                    rounded-xl
                                    bg-orange-600
                                    px-5
                                    text-sm
                                    font-semibold
                                    text-white
                                    shadow-sm
                                    transition
                                    hover:bg-orange-700
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >

                                {saving ? (

                                    <>

                                        <Loader2
                                            size={17}
                                            className="animate-spin"
                                        />

                                        Saving...

                                    </>

                                ) : (

                                    <>

                                        <Save size={17} />

                                        Save Changes

                                    </>

                                )}

                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>

    )

}