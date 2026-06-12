import prisma from "@/shared/lib/prisma"

export default async function Page() {

  const crew = await prisma.crewMember.findMany({
    include: {
      assignments: {
        include: {
          job: true
        }
      }
    }
  })

  return (
    <div>

      <h1 className="text-4xl font-semibold mb-6">
        Crew Assignment
      </h1>

      <div className="space-y-4">

        {crew.map(member => (

          <div
            key={member.id}
            className="bg-white border rounded-3xl p-6"
          >

            <div className="font-semibold">
              {member.name}
            </div>

            <div className="text-sm text-slate-500">
              {member.role}
            </div>

            <div className="mt-4 space-y-2">

              {member.assignments.map(a => (

                <div
                  key={a.id}
                  className="rounded-xl bg-slate-50 p-3"
                >
                  {a.job.title}
                </div>

              ))}

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}