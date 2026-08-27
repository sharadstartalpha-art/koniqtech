import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

import Link from "next/link";

import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    dispatchId: string;
  }>;
}

export default async function EditDispatchPage({
  params,
}: PageProps) {

  const { dispatchId } =
    await params;

  const session =
    await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const orgId =
    (session.user as any).orgId;

  const dispatchBoard =
    await prisma.dispatchBoard.findFirst({

      where: {
        id: dispatchId,
        orgId,
      },

      include: {

        jobs: {

          include: {

            job: {

              include: {

                customer: {

                  select: {

                    companyName: true,
                    firstName: true,
                    lastName: true,

                  },

                },

              },

            },

            technician: {

              select: {

                id: true,
                name: true,

              },

            },

            vehicle: {

              select: {

                id: true,
                name: true,

              },

            },

          },

        },

      },

    });

  if (!dispatchBoard) {
    notFound();
  }

  const [

    technicians,

    vehicles,

  ] = await Promise.all([

    prisma.user.findMany({

      where: {
        orgId,
      },

      select: {

        id: true,
        name: true,

      },

      orderBy: {
        name: "asc",
      },

    }),

    prisma.fleetVehicle.findMany({

      where: {
        orgId,
      },

      select: {

        id: true,
        name: true,

      },

      orderBy: {
        name: "asc",
      },

    }),

  ]);

  async function updateDispatch(
    formData: FormData
  ) {

    "use server";

    const session =
      await auth();

    if (!session?.user) {
      redirect("/login");
    }

    const orgId =
      (session.user as any).orgId;

    const title =
      formData.get("title")?.toString() ?? "";

    const dispatchDate =
      new Date(
        formData
          .get("dispatchDate")
          ?.toString() ?? ""
      );

    await prisma.$transaction(

      async (tx) => {

        await tx.dispatchBoard.update({

          where: {

            id: dispatchId,

            orgId,

          },

          data: {

            title,

            dispatchDate,

          },

        });

        const jobs =
          await tx.dispatchJob.findMany({

            where: {

              dispatchBoardId:
                dispatchId,

            },

          });

        for (const job of jobs) {

          const technicianId =
            formData
              .get(
                `technician-${job.id}`
              )
              ?.toString() || null;

          const vehicleId =
            formData
              .get(
                `vehicle-${job.id}`
              )
              ?.toString() || null;

          const priority =
            formData
              .get(
                `priority-${job.id}`
              )
              ?.toString() || "Normal";

          const status =
            formData
              .get(
                `status-${job.id}`
              )
              ?.toString() || "Pending";

          const eta =
            formData
              .get(
                `eta-${job.id}`
              )
              ?.toString() || "";

          await tx.dispatchJob.update({

            where: {

              id: job.id,

            },

            data: {

              technicianId:
                technicianId || null,

              vehicleId:
                vehicleId || null,

              priority,

              status,

              estimatedArrival:
                eta
                  ? new Date(eta)
                  : null,

            },

          });

        }

      }

    );

    redirect(
      `/dispatch/${dispatchId}`
    );

  }

  return (

    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold">
            Edit Dispatch
          </h1>

          <p className="mt-2 text-slate-600">
            Update dispatch board and assignments.
          </p>

        </div>

        <Link
          href={`/dispatch/${dispatchId}`}
          className="rounded-xl border px-5 py-3 hover:bg-slate-50"
        >
          Cancel
        </Link>

      </div>

      <form action={updateDispatch}>
              <div className="space-y-8 rounded-3xl border bg-white p-8">

        <div className="grid gap-6 md:grid-cols-2">

          <div>

            <label className="mb-2 block font-medium">
              Dispatch Title
            </label>

            <input
              type="text"
              name="title"
              required
              defaultValue={dispatchBoard.title}
              className="w-full rounded-xl border px-4 py-3"
            />

          </div>

          <div>

            <label className="mb-2 block font-medium">
              Dispatch Date
            </label>

            <input
              type="date"
              name="dispatchDate"
              required
              defaultValue={
                dispatchBoard.dispatchDate
                  .toISOString()
                  .split("T")[0]
              }
              className="w-full rounded-xl border px-4 py-3"
            />

          </div>

        </div>

        <div className="overflow-x-auto rounded-2xl border">

          <table className="min-w-full">

            <thead className="bg-slate-100">

              <tr>

                <th className="px-4 py-3 text-left">
                  Job
                </th>

                <th className="px-4 py-3 text-left">
                  Customer
                </th>

                <th className="px-4 py-3 text-left">
                  Technician
                </th>

                <th className="px-4 py-3 text-left">
                  Vehicle
                </th>

                <th className="px-4 py-3 text-left">
                  Priority
                </th>

                <th className="px-4 py-3 text-left">
                  ETA
                </th>

                <th className="px-4 py-3 text-left">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {dispatchBoard.jobs.map((dispatchJob) => (

                <tr
                  key={dispatchJob.id}
                  className="border-t"
                >

                  <td className="px-4 py-4 font-medium">

                    {dispatchJob.job.title}

                  </td>

                  <td className="px-4 py-4">

                    {dispatchJob.job.customer.companyName ??

                      `${dispatchJob.job.customer.firstName} ${dispatchJob.job.customer.lastName ?? ""}`}

                  </td>

                  <td className="px-4 py-4">

                    <select
                      name={`technician-${dispatchJob.id}`}
                      defaultValue={
                        dispatchJob.technicianId ?? ""
                      }
                      className="w-full rounded-lg border px-3 py-2"
                    >

                      <option value="">
                        Unassigned
                      </option>

                      {technicians.map((tech) => (

                        <option
                          key={tech.id}
                          value={tech.id}
                        >
                          {tech.name}
                        </option>

                      ))}

                    </select>

                  </td>

                  <td className="px-4 py-4">

                    <select
                      name={`vehicle-${dispatchJob.id}`}
                      defaultValue={
                        dispatchJob.vehicleId ?? ""
                      }
                      className="w-full rounded-lg border px-3 py-2"
                    >

                      <option value="">
                        None
                      </option>

                      {vehicles.map((vehicle) => (

                        <option
                          key={vehicle.id}
                          value={vehicle.id}
                        >
                          {vehicle.name}
                        </option>

                      ))}

                    </select>

                  </td>

                  <td className="px-4 py-4">

                    <select
                      name={`priority-${dispatchJob.id}`}
                      defaultValue={
                        dispatchJob.priority
                      }
                      className="rounded-lg border px-3 py-2"
                    >

                      <option>
                        Low
                      </option>

                      <option>
                        Normal
                      </option>

                      <option>
                        High
                      </option>

                      <option>
                        Emergency
                      </option>

                    </select>

                  </td>

                  <td className="px-4 py-4">

                    <input
                      type="datetime-local"
                      name={`eta-${dispatchJob.id}`}
                      defaultValue={
                        dispatchJob.estimatedArrival
                          ? new Date(
                              dispatchJob.estimatedArrival.getTime() -
                                dispatchJob.estimatedArrival.getTimezoneOffset() *
                                  60000
                            )
                              .toISOString()
                              .slice(0, 16)
                          : ""
                      }
                      className="rounded-lg border px-3 py-2"
                    />

                  </td>

                  <td className="px-4 py-4">

                    <select
                      name={`status-${dispatchJob.id}`}
                      defaultValue={
                        dispatchJob.status
                      }
                      className="rounded-lg border px-3 py-2"
                    >

                      <option>
                        Pending
                      </option>

                      <option>
                        Assigned
                      </option>

                      <option>
                        En Route
                      </option>

                      <option>
                        Arrived
                      </option>

                      <option>
                        Completed
                      </option>

                    </select>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
              <div className="flex items-center justify-end gap-4">

        <Link
          href={`/dispatch/${dispatchId}`}
          className="rounded-xl border border-slate-300 px-6 py-3 font-medium hover:bg-slate-50"
        >
          Cancel
        </Link>

        <button
          type="submit"
          className="rounded-xl bg-orange-500 px-8 py-3 font-medium text-white hover:bg-orange-600"
        >
          Save Changes
        </button>

      </div>

    </div>

      </form>

    </div>

  );

}