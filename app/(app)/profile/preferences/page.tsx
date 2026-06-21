import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function PreferencesPage() {

  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  return (

    <div className="max-w-4xl mx-auto space-y-8">

      <div>

        <h1 className="text-4xl font-bold">
          Preferences
        </h1>

        <p className="text-slate-500 mt-2">
          Personal settings
        </p>

      </div>

      <div
        className="
        bg-white
        border
        rounded-3xl
        p-8
        space-y-6
        "
      >

        <div>

          <label className="block mb-2">
            Timezone
          </label>

          <select
            className="
            w-full
            h-12
            border
            rounded-xl
            px-4
            "
          >

            <option>
              UTC
            </option>

            <option>
              Asia/Kolkata
            </option>

            <option>
              America/New_York
            </option>

          </select>

        </div>

        <div>

          <label className="block mb-2">
            Date Format
          </label>

          <select
            className="
            w-full
            h-12
            border
            rounded-xl
            px-4
            "
          >

            <option>
              DD/MM/YYYY
            </option>

            <option>
              MM/DD/YYYY
            </option>

          </select>

        </div>

        <div className="space-y-4">

          <label className="flex items-center gap-3">

            <input type="checkbox" />

            Email Notifications

          </label>

          <label className="flex items-center gap-3">

            <input type="checkbox" />

            SMS Notifications

          </label>

        </div>

        <button
          className="
          px-6
          py-3
          bg-orange-600
          text-white
          rounded-xl
          "
        >
          Save Preferences
        </button>

      </div>

    </div>

  )
}