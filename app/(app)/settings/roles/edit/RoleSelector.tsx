"use client"

import { useRouter } from "next/navigation"

export default function RoleSelector({
  role
}:{
  role:string
}) {

  const router = useRouter()

  return (

 <form action="/settings/roles/edit">

  <select
    name="role"
    defaultValue={role}
    onChange={(e)=>{
      e.currentTarget.form?.submit()
    }}
  >
    <option value="owner">Owner</option>
    <option value="admin">Admin</option>
    <option value="manager">Manager</option>
    <option value="sales">Sales</option>
    <option value="technician">Technician</option>
    <option value="support">Support</option>
    <option value="accountant">Accountant</option>
  </select>

</form>

  )
}