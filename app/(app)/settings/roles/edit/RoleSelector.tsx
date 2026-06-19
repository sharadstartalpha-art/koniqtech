"use client"

import { useRouter } from "next/navigation"

export default function RoleSelector({
  role
}:{
  role:string
}) {

  const router = useRouter()

  return (

    <select
      value={role}
      onChange={(e)=>{

        router.push(
          `/settings/roles/edit?role=${e.target.value}`
        )

      }}
      className="
      h-12
      px-4
      rounded-xl
      border
      w-80
      "
    >

      <option value="owner">owner</option>
      <option value="admin">admin</option>
      <option value="manager">manager</option>
      <option value="sales">sales</option>
      <option value="technician">technician</option>
      <option value="support">support</option>
      <option value="accountant">accountant</option>

    </select>

  )
}