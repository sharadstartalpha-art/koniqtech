
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
      where: { orgId },
    }),

    prisma.fleetVehicle.count({
      where: { orgId, active: true },
    }),

    prisma.fleetVehicle.count({
      where: { orgId, active: false },
    }),

    prisma.fleetAssignment.count({
      where: {
        vehicle: { orgId },
      },
    }),

    prisma.fleetTrip.count({
      where: {
        vehicle: { orgId },
      },
    }),

    prisma.fleetMaintenance.count({
      where: {
        vehicle: { orgId },
      },
    }),

    prisma.fleetFuelLog.count({
      where: {
        vehicle: { orgId },
      },
    }),

    prisma.fleetInspection.count({
      where: {
        vehicle: { orgId },
      },
    }),

    prisma.fleetVehicle.findMany({
      where: { orgId },

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

  // Only active assignments count toward current utilization.
  const vehicleStats = vehicles.map((vehicle) => {
    const activeAssignments = vehicle.assignments.filter(
      (assignment) => assignment.active
    );

    return {
      ...vehicle,
      activeAssignments: activeAssignments.length,
      isAssigned: activeAssignments.length > 0,
    };
  });

  // Utilization is calculated against active vehicles only.
  const assignedVehicles = vehicleStats.filter(
    (vehicle) => vehicle.active && vehicle.isAssigned
  ).length;

  const availableVehicles = Math.max(
    0,
    activeVehicles - assignedVehicles
  );

  const utilization =
    activeVehicles === 0
      ? 0
      : (assignedVehicles / activeVehicles) * 100;

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-4xl md:text-5xl font-bold">
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

      {/* KPI Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-3xl border bg-white p-6">
          <p className="text-slate-500">Total Vehicles</p>
          <h2 className="mt-3 text-4xl font-bold">
            {totalVehicles}
          </h2>
        </div>

        <div className="rounded-3xl border bg-white p-6">
          <p className="text-slate-500">Active Vehicles</p>
          <h2 className="mt-3 text-4xl font-bold text-green-600">
            {activeVehicles}
          </h2>
        </div>

        <div className="rounded-3xl border bg-white p-6">
          <p className="text-slate-500">Assigned Vehicles</p>
          <h2 className="mt-3 text-4xl font-bold text-blue-600">
            {assignedVehicles}
          </h2>
        </div>

        <div className="rounded-3xl border bg-white p-6">
          <p className="text-slate-500">Fleet Utilization</p>
          <h2 className="mt-3 text-4xl font-bold text-purple-600">
            {utilization.toFixed(1)}%
          </h2>
        </div>

      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 lg:grid-cols-2">

        <div className="rounded-3xl border bg-white p-8">

          <h2 className="mb-6 text-2xl font-bold">
            Fleet Operations Summary
          </h2>

          <dl className="space-y-5">

            <div className="flex items-center justify-between">
              <dt>Total Vehicles</dt>
              <dd className="font-semibold">{totalVehicles}</dd>
            </div>

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
              <dt>Available Active Vehicles</dt>
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
              <dd className="font-semibold">{totalTrips}</dd>
            </div>

            <div className="flex items-center justify-between">
              <dt>Maintenance Records</dt>
              <dd className="font-semibold text-orange-600">
                {totalMaintenance}
              </dd>
            </div>

            <div className="flex items-center justify-between">
              <dt>Fuel Logs</dt>
              <dd className="font-semibold">{totalFuelLogs}</dd>
            </div>

            <div className="flex items-center justify-between">
              <dt>Inspections</dt>
              <dd className="font-semibold">{totalInspections}</dd>
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

      {/* Fleet Vehicles Table */}
      <div className="overflow-hidden rounded-3xl border bg-white">

        <div className="border-b px-6 md:px-8 py-6">
          <h2 className="text-2xl font-bold">
            Fleet Vehicles
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Vehicle status, drivers and operational history.
          </p>
        </div>

        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead className="border-b bg-slate-50">

              <tr>
                <th className="px-6 py-4 text-left">Vehicle</th>
                <th className="px-6 py-4 text-left">Registration</th>
                <th className="px-6 py-4 text-left">Driver</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Assignments</th>
                <th className="px-6 py-4 text-center">Trips</th>
                <th className="px-6 py-4 text-center">Maintenance</th>
                <th className="px-6 py-4 text-center">Fuel Logs</th>
                <th className="px-6 py-4 text-center">Inspections</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>

            </thead>

            <tbody>

              {vehicleStats.map((vehicle) => (

                <tr
                  key={vehicle.id}
                  className="border-b last:border-0 hover:bg-slate-50"
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
                    <span
                      className={
                        vehicle.isAssigned
                          ? "font-semibold text-blue-600"
                          : "text-slate-500"
                      }
                    >
                      {vehicle.activeAssignments}
                    </span>
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

              ))}

              {vehicleStats.length === 0 && (
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

    </div>
  );
}
