"use client"

import { useRouter } from "next/navigation"

interface Role {
  id: string
  name: string
}

export default function RoleSelector({
  roleId,
  roles,
}: {
  roleId: string
  roles: Role[]
}) {
  const router = useRouter()

  return (
    <select
      value={roleId}
      onChange={(e) => {
        router.push(
          `/settings/roles/edit?role=${e.target.value}`
        )
      }}
      className="
        w-full
        h-12
        px-4
        rounded-xl
        border
      "
    >
      {roles.map((role) => (
        <option
          key={role.id}
          value={role.id}
        >
          {role.name}
        </option>
      ))}
    </select>
  )
}