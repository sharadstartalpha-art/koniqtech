"use client";

import { useMemo, useState } from "react";

import {
  HardDrive,
  Database,
  Cloud,
  Upload,
  Download,
  Trash2,
  Folder,
  FolderOpen,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Shield,
  Clock3,
  Settings,
  File,
} from "lucide-react";

type StorageProvider =
  | "AWS S3"
  | "Local";

type StorageStatus =
  | "Connected"
  | "Disconnected"
  | "Error";

interface StorageFile {
  id: string;

  name: string;

  folder: string;

  size: string;

  type: string;

  uploadedAt: string;

  status:
    | "Available"
    | "Processing";
}

const storageFiles: StorageFile[] = [
  {
    id: "1",

    name: "invoice.pdf",

    folder: "Invoices",

    size: "245 KB",

    type: "PDF",

    uploadedAt: "2026-08-05 14:30",

    status: "Available",
  },

  {
    id: "2",

    name: "roof-image.jpg",

    folder: "Jobs",

    size: "2.3 MB",

    type: "Image",

    uploadedAt: "2026-08-05 15:10",

    status: "Available",
  },

  {
    id: "3",

    name: "contract.docx",

    folder: "Documents",

    size: "420 KB",

    type: "Word",

    uploadedAt: "2026-08-05 15:45",

    status: "Processing",
  },

  {
    id: "4",

    name: "customer.csv",

    folder: "Exports",

    size: "190 KB",

    type: "CSV",

    uploadedAt: "2026-08-05 16:20",

    status: "Available",
  },
];

export default function StorageTestingPage() {

  const [provider, setProvider] =
    useState<StorageProvider>(
      "AWS S3"
    );

  const [storageStatus] =
    useState<StorageStatus>(
      "Connected"
    );

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  const [selectedFile, setSelectedFile] =
    useState<StorageFile | null>(
      null
    );

  const [actionLoading, setActionLoading] =
    useState(false);

    const [showDeleteModal, setShowDeleteModal] =
  useState(false);

const [showFilePreview, setShowFilePreview] =
  useState(false);

const [uploading, setUploading] =
  useState(false);

  const stats = useMemo(
    () => ({
      files:
        storageFiles.length,

      available:
        storageFiles.filter(
          (file) =>
            file.status ===
            "Available"
        ).length,

      processing:
        storageFiles.filter(
          (file) =>
            file.status ===
            "Processing"
        ).length,

      storageUsed:
        "3.1 GB",
    }),
    []
  );

  function refreshStatus() {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }

  function getStatusColor(
    status: StorageStatus
  ) {
    switch (status) {
      case "Connected":
        return "bg-green-100 text-green-700";

      case "Disconnected":
        return "bg-slate-100 text-slate-700";

      case "Error":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  }


async function testBucketConnection() {
  try {
    setActionLoading(true);

    // TODO:
    // GET /api/admin/developer-tools/storage/test

    setSuccess(
      "Bucket connection verified successfully."
    );
  } catch {
    setError(
      "Unable to connect to storage bucket."
    );
  } finally {
    setActionLoading(false);
  }
}

async function uploadTestFile() {
  try {
    setUploading(true);

    // TODO:
    // POST /api/admin/developer-tools/storage/upload

    setSuccess(
      "Test file uploaded successfully."
    );
  } catch {
    setError(
      "Unable to upload test file."
    );
  } finally {
    setUploading(false);
  }
}

async function generateSignedUrl(
  file: StorageFile
) {
  try {
    setActionLoading(true);

    // TODO:
    // POST /api/admin/developer-tools/storage/signed-url

    setSuccess(
      `Signed URL generated for ${file.name}.`
    );
  } catch {
    setError(
      "Unable to generate signed URL."
    );
  } finally {
    setActionLoading(false);
  }
}


async function downloadFile(
  file: StorageFile
) {
  try {
    setActionLoading(true);

    // TODO:
    // GET /api/admin/developer-tools/storage/download

    setSuccess(
      `${file.name} downloaded successfully.`
    );
  } catch {
    setError(
      "Unable to download file."
    );
  } finally {
    setActionLoading(false);
  }
}

async function deleteFile(
  file: StorageFile
) {
  try {
    setActionLoading(true);

    // TODO:
    // DELETE /api/admin/developer-tools/storage/delete

    setSuccess(
      `${file.name} deleted successfully.`
    );
  } catch {
    setError(
      "Unable to delete file."
    );
  } finally {
    setActionLoading(false);
  }
}

async function clearTemporaryFiles() {
  try {
    setActionLoading(true);

    // TODO:
    // POST /api/admin/developer-tools/storage/cleanup

    setSuccess(
      "Temporary files cleared."
    );
  } catch {
    setError(
      "Unable to clear temporary files."
    );
  } finally {
    setActionLoading(false);
  }
}


{showFilePreview &&
  selectedFile && (

<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">

  <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">

    <div className="border-b p-6">

      <h2 className="text-2xl font-bold">

        {selectedFile.name}

      </h2>

      <p className="mt-2 text-slate-500">

        File Information

      </p>

    </div>

    <div className="grid gap-6 p-6 md:grid-cols-2">

      <div>

        <p className="text-sm text-slate-500">
          File Name
        </p>

        <p className="mt-2 font-semibold">
          {selectedFile.name}
        </p>

      </div>

      <div>

        <p className="text-sm text-slate-500">
          Folder
        </p>

        <p className="mt-2 font-semibold">
          {selectedFile.folder}
        </p>

      </div>

      <div>

        <p className="text-sm text-slate-500">
          File Type
        </p>

        <p className="mt-2 font-semibold">
          {selectedFile.type}
        </p>

      </div>

      <div>

        <p className="text-sm text-slate-500">
          Size
        </p>

        <p className="mt-2 font-semibold">
          {selectedFile.size}
        </p>

      </div>

      <div className="md:col-span-2">

        <p className="text-sm text-slate-500">
          Uploaded
        </p>

        <p className="mt-2 font-semibold">
          {selectedFile.uploadedAt}
        </p>

      </div>

    </div>

    <div className="flex justify-end gap-3 border-t p-6">

      <button
        onClick={() =>
          setShowFilePreview(false)
        }
        className="rounded-xl border px-5 py-2"
      >
        Close
      </button>

      <button
        onClick={() =>
          downloadFile(selectedFile)
        }
        className="rounded-xl bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
      >
        Download
      </button>

    </div>

  </div>

</div>

)}

{showDeleteModal &&
  selectedFile && (

<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">

  <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">

    <div className="border-b p-6">

      <h2 className="text-xl font-bold text-red-600">
        Delete File
      </h2>

      <p className="mt-3 text-slate-600">

        Delete

        <strong>

          {" "}

          {selectedFile.name}

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

          deleteFile(selectedFile);

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





const activityLog = [
  {
    id: 1,
    action: "Uploaded invoice.pdf",
    status: "Success",
    time: "2 minutes ago",
  },
  {
    id: 2,
    action: "Generated Signed URL",
    status: "Success",
    time: "8 minutes ago",
  },
  {
    id: 3,
    action: "Deleted old-image.jpg",
    status: "Success",
    time: "15 minutes ago",
  },
  {
    id: 4,
    action: "Bucket Connection Test",
    status: "Success",
    time: "25 minutes ago",
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

      <section className="rounded-3xl bg-gradient-to-r from-sky-900 via-blue-900 to-slate-900 p-8 text-white shadow-xl">

        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

          <div>

            <div className="mb-4 flex items-center gap-4">

              <div className="rounded-2xl bg-white/10 p-4">

                <HardDrive className="h-8 w-8" />

              </div>

              <div>

                <h1 className="text-4xl font-bold">
                  Storage Testing
                </h1>

                <p className="mt-2 text-slate-200">
                  Test AWS S3 connectivity, uploads, downloads and bucket health.
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

            <button
              className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold hover:bg-green-700"
            >

              <ExternalLink className="h-5 w-5" />

              Open AWS Console

            </button>

          </div>

        </div>

      </section>

      {/* Statistics */}

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <Folder className="mb-4 h-8 w-8 text-blue-600" />

          <p className="text-sm text-slate-500">
            Total Files
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {stats.files}
          </h3>

        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <CheckCircle2 className="mb-4 h-8 w-8 text-green-600" />

          <p className="text-sm text-slate-500">
            Available
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {stats.available}
          </h3>

        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <AlertTriangle className="mb-4 h-8 w-8 text-amber-600" />

          <p className="text-sm text-slate-500">
            Processing
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {stats.processing}
          </h3>

        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <Database className="mb-4 h-8 w-8 text-indigo-600" />

          <p className="text-sm text-slate-500">
            Storage Used
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {stats.storageUsed}
          </h3>

        </div>

      </section>

      {/* Bucket Configuration */}

      <section className="rounded-2xl border bg-white shadow-sm">

        <div className="border-b p-6">

          <div className="flex items-center gap-3">

            <Settings className="h-6 w-6 text-blue-600" />

            <h2 className="text-2xl font-bold">
              Bucket Configuration
            </h2>

          </div>

        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-2">

          <div className="space-y-5">

            <div>

              <label className="mb-2 block text-sm font-semibold">
                Storage Provider
              </label>

              <select
                value={provider}
                onChange={(e) =>
                  setProvider(
                    e.target.value as StorageProvider
                  )
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              >

                <option>AWS S3</option>

                <option>Local</option>

              </select>

            </div>

            <div>

              <label className="mb-2 block text-sm font-semibold">
                Connection Status
              </label>

              <span
                className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${getStatusColor(
                  storageStatus
                )}`}
              >
                {storageStatus}
              </span>

            </div>

            <div>

              <label className="mb-2 block text-sm font-semibold">
                Bucket Name
              </label>

              <input
                disabled
                value="koniqtech-storage"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-semibold">
                AWS Region
              </label>

              <input
                disabled
                value="us-east-1"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3"
              />

            </div>

          </div>

          <div className="space-y-5">

            <div>

              <label className="mb-2 block text-sm font-semibold">
                Bucket URL
              </label>

              <input
                disabled
                value="https://koniqtech-storage.s3.amazonaws.com"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-semibold">
                Last Sync
              </label>

              <div className="flex items-center gap-2 rounded-xl border bg-slate-50 px-4 py-3">

                <Clock3 className="h-5 w-5 text-slate-400" />

                <span>
                  Today • 03:42 PM
                </span>

              </div>

            </div>

            <div>

              <label className="mb-2 block text-sm font-semibold">
                Bucket Health
              </label>

              <div className="flex items-center gap-2 rounded-xl border bg-green-50 px-4 py-3 text-green-700">

                <Shield className="h-5 w-5" />

                <span>
                  Healthy
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* Storage Files */}

      <section className="space-y-8">

  {/* Storage Files */}

  <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

    <div className="border-b p-6">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold">
            Storage Files
          </h2>

          <p className="mt-2 text-slate-500">
            Browse uploaded files in the storage bucket.
          </p>

        </div>

        <button
          className="rounded-xl border px-4 py-2 hover:bg-slate-100"
        >
          Refresh Files
        </button>

      </div>

    </div>

    <div className="overflow-x-auto">

      <table className="min-w-full">

        <thead className="bg-slate-50">

          <tr>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              File
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Folder
            </th>

            <th className="px-6 py-4 text-center text-sm font-semibold">
              Size
            </th>

            <th className="px-6 py-4 text-center text-sm font-semibold">
              Type
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

          {storageFiles.map((file) => (

            <tr
              key={file.id}
              className="border-t hover:bg-slate-50"
            >

              <td className="px-6 py-5">

                <div className="flex items-center gap-3">

                  <div className="rounded-lg bg-blue-100 p-2">

                    <File className="h-5 w-5 text-blue-600" />

                  </div>

                  <div>

                    <p className="font-semibold">

                      {file.name}

                    </p>

                    <p className="text-sm text-slate-500">

                      {file.uploadedAt}

                    </p>

                  </div>

                </div>

              </td>

              <td className="px-6 py-5">

                <div className="flex items-center gap-2">

                  <FolderOpen className="h-4 w-4 text-slate-500" />

                  {file.folder}

                </div>

              </td>

              <td className="px-6 py-5 text-center">

                {file.size}

              </td>

              <td className="px-6 py-5 text-center">

                {file.type}

              </td>

              <td className="px-6 py-5 text-center">

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    file.status === "Available"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >

                  {file.status}

                </span>

              </td>

              <td className="px-6 py-5">

                <div className="flex justify-end gap-2">

                  <button
  onClick={() => {
    setSelectedFile(file);
    setShowFilePreview(true);
  }}
  className="rounded-lg border p-2 hover:bg-blue-50"
  title="Preview"
>
  <Download className="h-4 w-4 text-blue-600" />
</button>
                  <button
                    onClick={() => {
  setSelectedFile(file);
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

  {/* Bucket Information */}

  <div className="grid gap-6 lg:grid-cols-2">

    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <h2 className="text-xl font-bold">
        Bucket Information
      </h2>

      <div className="mt-6 space-y-4">

        <div className="flex justify-between">

          <span className="text-slate-500">
            Bucket
          </span>

          <span className="font-semibold">
            koniqtech-storage
          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-slate-500">
            Region
          </span>

          <span className="font-semibold">
            us-east-1
          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-slate-500">
            Versioning
          </span>

          <span className="font-semibold text-green-600">
            Enabled
          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-slate-500">
            Encryption
          </span>

          <span className="font-semibold text-green-600">
            Enabled
          </span>

        </div>

      </div>

    </div>

    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <h2 className="text-xl font-bold">
        Storage Usage
      </h2>

      <div className="mt-6">

        <div className="mb-2 flex justify-between">

          <span className="text-slate-500">
            Used Space
          </span>

          <span className="font-semibold">
            3.1 GB / 100 GB
          </span>

        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-200">

          <div className="h-full w-[3%] rounded-full bg-blue-600" />

        </div>

      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">

        <div className="rounded-xl bg-slate-50 p-4">

          <p className="text-sm text-slate-500">
            Images
          </p>

          <p className="mt-2 text-2xl font-bold">
            1.8 GB
          </p>

        </div>

        <div className="rounded-xl bg-slate-50 p-4">

          <p className="text-sm text-slate-500">
            Documents
          </p>

          <p className="mt-2 text-2xl font-bold">
            1.3 GB
          </p>

        </div>

      </div>

    </div>

  </div>

</section>

<section className="rounded-2xl border bg-white shadow-sm">

  <div className="border-b p-6">

    <h2 className="text-2xl font-bold">
      Storage Testing
    </h2>

    <p className="mt-2 text-slate-500">
      Execute AWS S3 testing operations.
    </p>

  </div>

  <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">

    <button
      onClick={testBucketConnection}
      disabled={actionLoading}
      className="rounded-xl bg-blue-600 px-5 py-4 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
    >
      Test Bucket
    </button>

    <button
      onClick={uploadTestFile}
      disabled={uploading}
      className="rounded-xl bg-green-600 px-5 py-4 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
    >
      Upload Test File
    </button>

    <button
      onClick={() =>
        selectedFile &&
        generateSignedUrl(selectedFile)
      }
      disabled={!selectedFile || actionLoading}
      className="rounded-xl bg-indigo-600 px-5 py-4 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
    >
      Generate Signed URL
    </button>

    <button
      onClick={refreshStatus}
      disabled={loading}
      className="rounded-xl bg-amber-600 px-5 py-4 font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
    >
      Refresh Storage
    </button>

    <button
      onClick={clearTemporaryFiles}
      disabled={actionLoading}
      className="rounded-xl bg-red-600 px-5 py-4 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
    >
      Clear Temp Files
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


<section className="rounded-2xl border bg-white shadow-sm">

  <div className="border-b p-6">

    <h2 className="text-2xl font-bold">
      Storage Activity
    </h2>

    <p className="mt-2 text-slate-500">
      Recent storage operations.
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

        <span
          className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
        >

          {item.status}

        </span>

      </div>

    ))}

  </div>

</section>

    </div>
  );
}