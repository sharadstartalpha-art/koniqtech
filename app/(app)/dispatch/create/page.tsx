import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CreateDispatchBoardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const orgId = (session.user as any).orgId;
  const userId = (session.user as any).id;

  const [jobs, technicians, vehicles] = await Promise.all([
    prisma.job.findMany({
      where: {
        orgId,
      },
      select: {
        id: true,
        title: true,
        status: true,
        customer: {
          select: {
            firstName: true,
            lastName: true,
            companyName: true,
          },
        },
      },
      orderBy: {
        title: "asc",
      },
    }),

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

  async function createDispatchBoard(formData: FormData) {
    "use server";

    const session = await auth();

    if (!session?.user) {
      redirect("/login");
    }

    const orgId = (session.user as any).orgId;
    const userId = (session.user as any).id;

    const title =
      formData.get("title")?.toString().trim() ?? "";

    const dispatchDateString =
      formData.get("dispatchDate")?.toString() ?? "";

    if (!title || !dispatchDateString) {
      throw new Error(
        "Title and Dispatch Date are required."
      );
    }

    const dispatchDate =
      new Date(dispatchDateString);

    const jobs = formData.getAll("jobId");
        await prisma.$transaction(async (tx) => {
      const board =
        await tx.dispatchBoard.create({
          data: {
            orgId,
            title,
            dispatchDate,
            createdById: userId,
          },
        });

      for (const jobId of jobs) {
        const technicianId =
          formData
            .get(`technician-${jobId}`)
            ?.toString() || null;

        const vehicleId =
          formData
            .get(`vehicle-${jobId}`)
            ?.toString() || null;

        const priority =
          formData
            .get(`priority-${jobId}`)
            ?.toString() || "Normal";

        const status =
          formData
            .get(`status-${jobId}`)
            ?.toString() || "Pending";

        const etaValue =
          formData
            .get(`eta-${jobId}`)
            ?.toString() || "";

        await tx.dispatchJob.create({
          data: {
            dispatchBoardId: board.id,
            jobId: jobId.toString(),

            technicianId:
              technicianId || undefined,

            vehicleId:
              vehicleId || undefined,

            priority,
            status,

            estimatedArrival: etaValue
              ? new Date(etaValue)
              : null,
          },
        });
      }
    });

    redirect("/dispatch");
  }

  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold">
            Create Dispatch Board
          </h1>

          <p className="mt-2 text-slate-600">
            Schedule jobs and assign technicians.
          </p>

        </div>

        <Link
          href="/dispatch"
          className="rounded-xl border px-6 py-3 hover:bg-slate-50"
        >
          Back
        </Link>

      </div>

      <form action={createDispatchBoard}>
              <div className="space-y-8 rounded-3xl border bg-white p-8">

        <div className="grid gap-6 md:grid-cols-2">

          <div>

            <label className="mb-2 block font-medium">
              Board Title
            </label>

            <input
              type="text"
              name="title"
              required
              placeholder="Today's Dispatch"
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
                new Date().toISOString().split("T")[0]
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
                  Assign
                </th>

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

              {jobs.map((job) => (

                <tr
                  key={job.id}
                  className="border-t"
                >

                  <td className="px-4 py-4">

                    <input
                      type="checkbox"
                      name="jobId"
                      value={job.id}
                    />

                  </td>

                  <td className="px-4 py-4 font-medium">

                    {job.title}

                  </td>

                  <td className="px-4 py-4">

                    {job.customer.companyName ??
                      `${job.customer.firstName} ${job.customer.lastName ?? ""}`}

                  </td>

                  <td className="px-4 py-4">

                    <select
                      name={`technician-${job.id}`}
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
                      name={`vehicle-${job.id}`}
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
                      name={`priority-${job.id}`}
                      defaultValue="Normal"
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
                      name={`eta-${job.id}`}
                      className="rounded-lg border px-3 py-2"
                    />

                  </td>

                  <td className="px-4 py-4">

                    <select
                      name={`status-${job.id}`}
                      defaultValue="Pending"
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

        <div className="flex justify-end gap-4">

          <Link
            href="/dispatch"
            className="rounded-xl border px-6 py-3 hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="rounded-xl bg-orange-500 px-8 py-3 font-medium text-white hover:bg-orange-600"
          >
            Create Dispatch Board
          </button>

        </div>

      </div>

    </form>

    </div>

  );
}