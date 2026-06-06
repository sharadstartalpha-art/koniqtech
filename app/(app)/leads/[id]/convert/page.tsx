"use client"

import { useRouter } from "next/navigation"

export default function Page(){

  const router=useRouter()

  async function convert(){

    const id=
    window.location.pathname.split("/")[2]

    await fetch(
      `/api/leads/${id}/convert`,
      {
        method:"POST"
      }
    )

    router.push("/customers")
  }

  return(

    <div className="max-w-xl">

      <h1 className="text-4xl font-bold mb-8">
        Convert Lead
      </h1>

      <button
        onClick={convert}
        className="
        px-6
        py-4
        bg-green-600
        text-white
        rounded-xl
        "
      >
        Convert To Customer
      </button>

    </div>

  )

}