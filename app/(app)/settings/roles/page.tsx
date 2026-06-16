const ROLES = [

  "owner",
  "admin",
  "manager",
  "sales",
  "technician",
  "support",
  "accountant",
  "super_admin"

]

export default function RolesPage(){

  return(

    <div className="space-y-8">

      <div>

        <h1 className="text-4xl font-bold">
          Roles & Permissions
        </h1>

      </div>

      <div className="grid md:grid-cols-3 gap-6">

        {ROLES.map(role=>(

          <div
            key={role}
            className="
            bg-white
            border
            rounded-3xl
            p-6
            "
          >

            <h2 className="text-xl font-semibold capitalize">
              {role.replace("_"," ")}
            </h2>

          </div>

        ))}

      </div>

    </div>

  )

}