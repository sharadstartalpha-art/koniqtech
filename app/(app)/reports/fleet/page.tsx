import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function FleetReportPage() {

  const session = await auth();

  if (!session?.user?.orgId) {
    redirect("/login");
  }

  const orgId = session.user.orgId;

  const [

    totalVehicles,

    activeVehicles,

    inactiveVehicles,

    totalAssignments,

    totalTrips,

    totalMaintenance,

    totalFuelLogs,

    totalInspections,

    vehicles,

  ] = await Promise.all([

    prisma.fleetVehicle.count({

      where: {
        orgId,
      },

    }),

    prisma.fleetVehicle.count({

      where: {
        orgId,
        active: true,
      },

    }),

    prisma.fleetVehicle.count({

      where: {
        orgId,
        active: false,
      },

    }),

    prisma.fleetAssignment.count({

      where: {

        vehicle: {
          orgId,
        },

      },

    }),

    prisma.fleetTrip.count({

      where: {

        vehicle: {
          orgId,
        },

      },

    }),

    prisma.fleetMaintenance.count({

      where: {

        vehicle: {
          orgId,
        },

      },

    }),

    prisma.fleetFuelLog.count({

      where: {

        vehicle: {
          orgId,
        },

      },

    }),

    prisma.fleetInspection.count({

      where: {

        vehicle: {
          orgId,
        },

      },

    }),

    prisma.fleetVehicle.findMany({

      where: {
        orgId,
      },

      include: {

        driver: true,

        assignments: true,

        trips: true,

        maintenances: true,

        fuelLogs: true,

        inspections: true,

      },

      orderBy: {
        name: "asc",
      },

    }),

  ]);

  const assignedVehicles =
    vehicles.filter(
      (vehicle) =>
        vehicle.assignments.some(
          (assignment) => assignment.active,
        ),
    ).length;

  const availableVehicles =
    totalVehicles - assignedVehicles;

  const utilization =

    totalVehicles === 0

      ? 0

      : (assignedVehicles / totalVehicles) * 100;

  return (

    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold">
            Fleet Report
          </h1>

          <p className="mt-2 text-slate-600">
            Fleet utilization, maintenance, trips, fuel usage and vehicle activity.
          </p>

        </div>

        <Link
          href="/reports"
          className="rounded-xl border px-6 py-3 hover:bg-slate-50"
        >
          Back
        </Link>

      </div>

      <div className="grid gap-6 lg:grid-cols-4">

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-slate-500">
            Total Vehicles
          </p>

          <h2 className="mt-3 text-4xl font-bold">
            {totalVehicles}
          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-slate-500">
            Active Vehicles
          </p>

          <h2 className="mt-3 text-4xl font-bold text-green-600">
            {activeVehicles}
          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-slate-500">
            Assigned Vehicles
          </p>

          <h2 className="mt-3 text-4xl font-bold text-blue-600">
            {assignedVehicles}
          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-slate-500">
            Fleet Utilization
          </p>

          <h2 className="mt-3 text-4xl font-bold text-purple-600">
            {utilization.toFixed(1)}%
          </h2>

        </div>

      </div>

            <div className="grid gap-6 lg:grid-cols-2">

        <div className="rounded-3xl border bg-white p-8">

          <h2 className="mb-6 text-2xl font-bold">
            Fleet Operations Summary
          </h2>

          <dl className="space-y-5">

            <div className="flex items-center justify-between">

              <dt>Active Vehicles</dt>

              <dd className="font-semibold text-green-600">
                {activeVehicles}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Inactive Vehicles</dt>

              <dd className="font-semibold text-red-600">
                {inactiveVehicles}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Assigned Vehicles</dt>

              <dd className="font-semibold text-blue-600">
                {assignedVehicles}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Available Vehicles</dt>

              <dd className="font-semibold">
                {availableVehicles}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Fleet Utilization</dt>

              <dd className="font-semibold text-purple-600">
                {utilization.toFixed(1)}%
              </dd>

            </div>

          </dl>

        </div>

        <div className="rounded-3xl border bg-white p-8">

          <h2 className="mb-6 text-2xl font-bold">
            Fleet Activity
          </h2>

          <dl className="space-y-5">

            <div className="flex items-center justify-between">

              <dt>Total Trips</dt>

              <dd className="font-semibold">
                {totalTrips}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Maintenance Records</dt>

              <dd className="font-semibold text-orange-600">
                {totalMaintenance}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Fuel Logs</dt>

              <dd className="font-semibold">
                {totalFuelLogs}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Inspections</dt>

              <dd className="font-semibold">
                {totalInspections}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Total Assignments</dt>

              <dd className="font-semibold text-blue-600">
                {totalAssignments}
              </dd>

            </div>

          </dl>

        </div>

      </div>

      <div className="overflow-hidden rounded-3xl border bg-white">

        <div className="border-b px-8 py-6">

          <h2 className="text-2xl font-bold">
            Fleet Vehicles
          </h2>

        </div>

        <table className="min-w-full">

          <thead className="border-b bg-slate-50">

            <tr>

              <th className="px-6 py-4 text-left">
                Vehicle
              </th>

              <th className="px-6 py-4 text-left">
                Registration
              </th>

              <th className="px-6 py-4 text-left">
                Driver
              </th>

              <th className="px-6 py-4 text-center">
                Active
              </th>

              <th className="px-6 py-4 text-center">
                Assignments
              </th>

              <th className="px-6 py-4 text-center">
                Trips
              </th>

              <th className="px-6 py-4 text-center">
                Maintenance
              </th>

              <th className="px-6 py-4 text-center">
                Fuel Logs
              </th>

              <th className="px-6 py-4 text-center">
                Inspections
              </th>

              <th className="px-6 py-4 text-right">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

                        {vehicles.map((vehicle) => {

              const activeAssignment =
                vehicle.assignments.find(
                  (assignment) => assignment.active,
                );

              return (

                <tr
                  key={vehicle.id}
                  className="border-b last:border-0"
                >

                  <td className="px-6 py-4">

                    <Link
                      href={`/fleet/${vehicle.id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {vehicle.name}
                    </Link>

                    <div className="text-sm text-slate-500">
                      {vehicle.vehicleNumber}
                    </div>

                  </td>

                  <td className="px-6 py-4">

                    {vehicle.registrationNumber ?? "-"}

                  </td>

                  <td className="px-6 py-4">

                    {vehicle.driver?.name ?? "-"}

                  </td>

                  <td className="px-6 py-4 text-center">

                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                        vehicle.active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {vehicle.active ? "Active" : "Inactive"}
                    </span>

                  </td>

                  <td className="px-6 py-4 text-center">

                    {activeAssignment ? (
                      <span className="font-medium text-blue-600">
                        Assigned
                      </span>
                    ) : (
                      <span className="text-slate-500">
                        Available
                      </span>
                    )}

                  </td>

                  <td className="px-6 py-4 text-center">
                    {vehicle.trips.length}
                  </td>

                  <td className="px-6 py-4 text-center">
                    {vehicle.maintenances.length}
                  </td>

                  <td className="px-6 py-4 text-center">
                    {vehicle.fuelLogs.length}
                  </td>

                  <td className="px-6 py-4 text-center">
                    {vehicle.inspections.length}
                  </td>

                  <td className="px-6 py-4 text-right">

                    <Link
                      href={`/fleet/${vehicle.id}`}
                      className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-50"
                    >
                      View
                    </Link>

                  </td>

                </tr>

              );

            })}

            {vehicles.length === 0 && (

              <tr>

                <td
                  colSpan={10}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  No fleet vehicles found.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

}