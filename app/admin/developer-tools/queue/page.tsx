"use client";

import { useMemo, useState } from "react";

import {
  Server,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Play,
  Pause,
  RotateCcw,
  Trash2,
  Settings,
  Activity,
  Database,
  Timer,
} from "lucide-react";

type QueueStatus =
  | "Running"
  | "Paused"
  | "Stopped";

type JobStatus =
  | "Pending"
  | "Processing"
  | "Completed"
  | "Failed";

interface QueueJob {
  id: string;

  name: string;

  queue: string;

  attempts: number;

  status: JobStatus;

  createdAt: string;
}

const queueJobs: QueueJob[] = [
  {
    id: "1",

    name: "Send Welcome Email",

    queue: "emails",

    attempts: 1,

    status: "Completed",

    createdAt: "2026-08-05 14:20",
  },

  {
    id: "2",

    name: "Generate Invoice PDF",

    queue: "documents",

    attempts: 1,

    status: "Processing",

    createdAt: "2026-08-05 14:45",
  },

  {
    id: "3",

    name: "Sync PayPal Subscription",

    queue: "billing",

    attempts: 2,

    status: "Failed",

    createdAt: "2026-08-05 15:10",
  },

  {
    id: "4",

    name: "Create Daily Backup",

    queue: "system",

    attempts: 1,

    status: "Pending",

    createdAt: "2026-08-05 15:40",
  },
];

export default function QueueTestingPage() {

  const [queueStatus] =
    useState<QueueStatus>(
      "Running"
    );

  const [loading, setLoading] =
    useState(false);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  const [selectedJob, setSelectedJob] =
    useState<QueueJob | null>(null);

    const [showRetryModal, setShowRetryModal] =
  useState(false);

const [showDeleteModal, setShowDeleteModal] =
  useState(false);

const [showJobModal, setShowJobModal] =
  useState(false);

  const stats = useMemo(
    () => ({
      total: queueJobs.length,

      pending:
        queueJobs.filter(
          (job) =>
            job.status === "Pending"
        ).length,

      processing:
        queueJobs.filter(
          (job) =>
            job.status === "Processing"
        ).length,

      failed:
        queueJobs.filter(
          (job) =>
            job.status === "Failed"
        ).length,
    }),
    []
  );

  function refreshStatus() {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }

  function getQueueColor(
    status: QueueStatus
  ) {
    switch (status) {

      case "Running":
        return "bg-green-100 text-green-700";

      case "Paused":
        return "bg-yellow-100 text-yellow-700";

      case "Stopped":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  }

  async function startQueue() {
  try {
    setActionLoading(true);

    // TODO:
    // POST /api/admin/developer-tools/queue/start

    setSuccess(
      "Queue worker started successfully."
    );
  } catch {
    setError(
      "Unable to start queue worker."
    );
  } finally {
    setActionLoading(false);
  }
}

async function pauseQueue() {
  try {
    setActionLoading(true);

    // TODO:
    // POST /api/admin/developer-tools/queue/pause

    setSuccess(
      "Queue worker paused."
    );
  } catch {
    setError(
      "Unable to pause queue."
    );
  } finally {
    setActionLoading(false);
  }
}

async function retryJob(
  job: QueueJob
) {
  try {
    setActionLoading(true);

    // TODO:
    // POST /api/admin/developer-tools/queue/retry

    setSuccess(
      `${job.name} queued again.`
    );
  } catch {
    setError(
      "Unable to retry job."
    );
  } finally {
    setActionLoading(false);
  }
}

async function deleteJob(
  job: QueueJob
) {
  try {
    setActionLoading(true);

    // TODO:
    // DELETE /api/admin/developer-tools/queue/delete

    setSuccess(
      `${job.name} deleted.`
    );
  } catch {
    setError(
      "Unable to delete job."
    );
  } finally {
    setActionLoading(false);
  }
}

async function clearFailedJobs() {
  try {
    setActionLoading(true);

    // TODO:
    // POST /api/admin/developer-tools/queue/clear-failed

    setSuccess(
      "Failed jobs cleared."
    );
  } catch {
    setError(
      "Unable to clear failed jobs."
    );
  } finally {
    setActionLoading(false);
  }
}


const activityLog = [
  {
    id: 1,
    action: "Queue Worker Started",
    status: "Success",
    time: "2 minutes ago",
  },
  {
    id: 2,
    action: "Retry Job",
    status: "Success",
    time: "8 minutes ago",
  },
  {
    id: 3,
    action: "Deleted Failed Job",
    status: "Success",
    time: "15 minutes ago",
  },
  {
    id: 4,
    action: "Queue Refreshed",
    status: "Success",
    time: "20 minutes ago",
  },
];

  return (
  <div className="space-y-8">

    {success && (
      <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
        {success}
      </div>
    )}

    {error && (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
        {error}
      </div>
    )}

    {/* Header */}

    <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 p-8 text-white shadow-xl">

      <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

        <div>

          <div className="mb-4 flex items-center gap-4">

            <div className="rounded-2xl bg-white/10 p-4">

              <Server className="h-8 w-8" />

            </div>

            <div>

              <h1 className="text-4xl font-bold">
                Queue Testing
              </h1>

              <p className="mt-2 text-slate-200">
                Test background jobs, queue workers, retries and failed jobs.
              </p>

            </div>

          </div>

        </div>

        <div className="flex flex-wrap gap-3">

          <button
            onClick={refreshStatus}
            className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 font-medium hover:bg-white/20"
          >

            <RefreshCw
              className={`h-5 w-5 ${
                loading ? "animate-spin" : ""
              }`}
            />

            Refresh

          </button>

        </div>

      </div>

    </section>

    {/* Statistics */}

    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <Database className="mb-4 h-8 w-8 text-blue-600" />

        <p className="text-sm text-slate-500">
          Total Jobs
        </p>

        <h3 className="mt-2 text-3xl font-bold">
          {stats.total}
        </h3>

      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <Clock3 className="mb-4 h-8 w-8 text-yellow-600" />

        <p className="text-sm text-slate-500">
          Pending
        </p>

        <h3 className="mt-2 text-3xl font-bold">
          {stats.pending}
        </h3>

      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <Activity className="mb-4 h-8 w-8 text-indigo-600" />

        <p className="text-sm text-slate-500">
          Processing
        </p>

        <h3 className="mt-2 text-3xl font-bold">
          {stats.processing}
        </h3>

      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <AlertTriangle className="mb-4 h-8 w-8 text-red-600" />

        <p className="text-sm text-slate-500">
          Failed
        </p>

        <h3 className="mt-2 text-3xl font-bold">
          {stats.failed}
        </h3>

      </div>

    </section>

    {/* Queue Configuration */}

    <section className="rounded-2xl border bg-white shadow-sm">

      <div className="border-b p-6">

        <div className="flex items-center gap-3">

          <Settings className="h-6 w-6 text-blue-600" />

          <h2 className="text-2xl font-bold">
            Queue Configuration
          </h2>

        </div>

      </div>

      <div className="grid gap-6 p-6 lg:grid-cols-2">

        <div className="space-y-5">

          <div>

            <label className="mb-2 block text-sm font-semibold">
              Queue Driver
            </label>

            <input
              disabled
              value="Database"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-semibold">
              Queue Status
            </label>

            <span
              className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${getQueueColor(
                queueStatus
              )}`}
            >
              {queueStatus}
            </span>

          </div>

          <div>

            <label className="mb-2 block text-sm font-semibold">
              Worker
            </label>

            <input
              disabled
              value="queue-worker-01"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3"
            />

          </div>

        </div>

        <div className="space-y-5">

          <div>

            <label className="mb-2 block text-sm font-semibold">
              Retry Attempts
            </label>

            <input
              disabled
              value="3"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-semibold">
              Timeout
            </label>

            <input
              disabled
              value="120 Seconds"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-semibold">
              Last Worker Heartbeat
            </label>

            <div className="flex items-center gap-2 rounded-xl border bg-slate-50 px-4 py-3">

              <Timer className="h-5 w-5 text-slate-500" />

              <span>
                Today • 04:15 PM
              </span>

            </div>

          </div>

        </div>

      </div>

    </section>

    {/* Queue Jobs */}

    <section className="space-y-8">

  {/* Queue Jobs */}

  <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

    <div className="border-b p-6">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold">
            Queue Jobs
          </h2>

          <p className="mt-2 text-slate-500">
            Monitor all queued background jobs.
          </p>

        </div>

        <button className="rounded-xl border px-4 py-2 hover:bg-slate-100">

          Refresh Queue

        </button>

      </div>

    </div>

    <div className="overflow-x-auto">

      <table className="min-w-full">

        <thead className="bg-slate-50">

          <tr>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Job
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Queue
            </th>

            <th className="px-6 py-4 text-center text-sm font-semibold">
              Attempts
            </th>

            <th className="px-6 py-4 text-center text-sm font-semibold">
              Status
            </th>

            <th className="px-6 py-4 text-right text-sm font-semibold">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {queueJobs.map((job) => (

            <tr
              key={job.id}
              className="border-t hover:bg-slate-50"
            >

              <td className="px-6 py-5">

                <div>

                  <p className="font-semibold">

                    {job.name}

                  </p>

                  <p className="text-sm text-slate-500">

                    {job.createdAt}

                  </p>

                </div>

              </td>

              <td className="px-6 py-5">

                {job.queue}

              </td>

              <td className="px-6 py-5 text-center">

                {job.attempts}

              </td>

              <td className="px-6 py-5 text-center">

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    job.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : job.status === "Processing"
                      ? "bg-blue-100 text-blue-700"
                      : job.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >

                  {job.status}

                </span>

              </td>

              <td className="px-6 py-5">

                <div className="flex justify-end gap-2">

                  <button
                    onClick={() => {
  setSelectedJob(job);
  setShowRetryModal(true);
}}
                    className="rounded-lg border p-2 hover:bg-green-50"
                    title="Retry"
                  >

                    <RotateCcw className="h-4 w-4 text-green-600" />

                  </button>

                  <button
                    onClick={() => {
  setSelectedJob(job);
  setShowJobModal(true);
}}
                    className="rounded-lg border p-2 hover:bg-blue-50"
                    title="View"
                  >

                    <Activity className="h-4 w-4 text-blue-600" />

                  </button>

                  <button
                   onClick={() => {
  setSelectedJob(job);
  setShowDeleteModal(true);
}}
                    className="rounded-lg border p-2 hover:bg-red-50"
                    title="Delete"
                  >

                    <Trash2 className="h-4 w-4 text-red-600" />

                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  </div>

  {/* Failed Jobs */}

  <div className="rounded-2xl border bg-white shadow-sm">

    <div className="border-b p-6">

      <h2 className="text-2xl font-bold">
        Failed Jobs
      </h2>

      <p className="mt-2 text-slate-500">
        Jobs that require manual intervention.
      </p>

    </div>

    <div className="divide-y">

      {queueJobs
        .filter(
          (job) =>
            job.status === "Failed"
        )
        .map((job) => (

          <div
            key={job.id}
            className="flex items-center justify-between p-5 hover:bg-slate-50"
          >

            <div>

              <p className="font-semibold">

                {job.name}

              </p>

              <p className="mt-1 text-sm text-slate-500">

                Queue: {job.queue}

              </p>

              <p className="text-xs text-slate-400">

                Attempts: {job.attempts}

              </p>

            </div>

            <button
              onClick={() => {
  setSelectedJob(job);
  setShowRetryModal(true);
}}
              className="rounded-xl bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >

              Retry

            </button>

          </div>

        ))}

      {queueJobs.filter(
        (job) =>
          job.status === "Failed"
      ).length === 0 && (

        <div className="p-10 text-center text-slate-500">

          No failed jobs.

        </div>

      )}

    </div>

  </div>

</section>

<section className="rounded-2xl border bg-white shadow-sm">

  <div className="border-b p-6">

    <h2 className="text-2xl font-bold">
      Queue Actions
    </h2>

    <p className="mt-2 text-slate-500">
      Execute queue maintenance and testing operations.
    </p>

  </div>

  <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">

    <button
      onClick={startQueue}
      disabled={actionLoading}
      className="rounded-xl bg-green-600 px-5 py-4 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
    >
      <div className="flex items-center justify-center gap-2">

        <Play className="h-5 w-5" />

        Start Queue

      </div>

    </button>

    <button
      onClick={pauseQueue}
      disabled={actionLoading}
      className="rounded-xl bg-yellow-600 px-5 py-4 font-semibold text-white hover:bg-yellow-700 disabled:opacity-50"
    >
      <div className="flex items-center justify-center gap-2">

        <Pause className="h-5 w-5" />

        Pause Queue

      </div>

    </button>

    <button
      onClick={refreshStatus}
      disabled={loading}
      className="rounded-xl bg-blue-600 px-5 py-4 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
    >
      <div className="flex items-center justify-center gap-2">

        <RefreshCw className="h-5 w-5" />

        Refresh Queue

      </div>

    </button>

    <button
      onClick={clearFailedJobs}
      disabled={actionLoading}
      className="rounded-xl bg-red-600 px-5 py-4 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
    >
      <div className="flex items-center justify-center gap-2">

        <Trash2 className="h-5 w-5" />

        Clear Failed

      </div>

    </button>

    <button
      onClick={() => {
        setSuccess("");
        setError("");
      }}
      className="rounded-xl border px-5 py-4 hover:bg-slate-100"
    >
      Clear Messages
    </button>

  </div>

</section>

{showJobModal &&
selectedJob && (

<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">

  <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl">

    <div className="border-b p-6">

      <h2 className="text-2xl font-bold">
        Job Details
      </h2>

    </div>

    <div className="grid gap-6 p-6">

      <div>

        <p className="text-sm text-slate-500">
          Job Name
        </p>

        <p className="mt-2 font-semibold">
          {selectedJob.name}
        </p>

      </div>

      <div>

        <p className="text-sm text-slate-500">
          Queue
        </p>

        <p className="mt-2 font-semibold">
          {selectedJob.queue}
        </p>

      </div>

      <div>

        <p className="text-sm text-slate-500">
          Attempts
        </p>

        <p className="mt-2 font-semibold">
          {selectedJob.attempts}
        </p>

      </div>

      <div>

        <p className="text-sm text-slate-500">
          Status
        </p>

        <p className="mt-2 font-semibold">
          {selectedJob.status}
        </p>

      </div>

      <div>

        <p className="text-sm text-slate-500">
          Created
        </p>

        <p className="mt-2 font-semibold">
          {selectedJob.createdAt}
        </p>

      </div>

    </div>

    <div className="flex justify-end border-t p-6">

      <button
        onClick={() =>
          setShowJobModal(false)
        }
        className="rounded-xl border px-5 py-2"
      >
        Close
      </button>

    </div>

  </div>

</div>

)}

{showRetryModal &&
selectedJob && (

<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">

  <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">

    <div className="border-b p-6">

      <h2 className="text-xl font-bold">
        Retry Job
      </h2>

      <p className="mt-3 text-slate-600">

        Retry

        <strong>

          {" "}

          {selectedJob.name}

        </strong>

        ?

      </p>

    </div>

    <div className="flex justify-end gap-3 p-6">

      <button
        onClick={() =>
          setShowRetryModal(false)
        }
        className="rounded-xl border px-5 py-2"
      >
        Cancel
      </button>

      <button
        onClick={() => {

          retryJob(selectedJob);

          setShowRetryModal(false);

        }}
        className="rounded-xl bg-green-600 px-5 py-2 text-white hover:bg-green-700"
      >
        Retry
      </button>

    </div>

  </div>

</div>

)}


{showDeleteModal &&
selectedJob && (

<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">

  <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">

    <div className="border-b p-6">

      <h2 className="text-xl font-bold text-red-600">
        Delete Job
      </h2>

      <p className="mt-3 text-slate-600">

        Delete

        <strong>

          {" "}

          {selectedJob.name}

        </strong>

        ?

      </p>

    </div>

    <div className="flex justify-end gap-3 p-6">

      <button
        onClick={() =>
          setShowDeleteModal(false)
        }
        className="rounded-xl border px-5 py-2"
      >
        Cancel
      </button>

      <button
        onClick={() => {

          deleteJob(selectedJob);

          setShowDeleteModal(false);

        }}
        className="rounded-xl bg-red-600 px-5 py-2 text-white hover:bg-red-700"
      >
        Delete
      </button>

    </div>

  </div>

</div>

)}


<section className="rounded-2xl border bg-white shadow-sm">

  <div className="border-b p-6">

    <h2 className="text-2xl font-bold">
      Queue Activity
    </h2>

    <p className="mt-2 text-slate-500">
      Recent queue operations.
    </p>

  </div>

  <div className="divide-y">

    {activityLog.map((item) => (

      <div
        key={item.id}
        className="flex items-center justify-between p-5 hover:bg-slate-50"
      >

        <div>

          <p className="font-semibold">

            {item.action}

          </p>

          <p className="mt-1 text-sm text-slate-500">

            {item.time}

          </p>

        </div>

        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">

          {item.status}

        </span>

      </div>

    ))}

  </div>

</section>

    </div>
  );
}