"use client";

import { useEffect, useMemo, useState } from "react";

import axios from "axios";

import Layout from "@/components/Layout";

import EmailViewerModal from "@/components/EmailViewerModal";

/* =========================
   TYPES
========================= */

type Reminder = {
  id: string;

  email: string;

  amount: number;

  type: string;

  status: string;

  mode: "manual" | "auto";

  sentAt: string;

  html?: string;

  userId?: string;
};

type User = {
  id: string;

  email: string;
};

/* =========================
   PAGE
========================= */

export default function RemindersPage() {
  const [data, setData] =
    useState<Reminder[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [mode, setMode] =
    useState<
      "all" | "manual" | "auto"
    >("all");

  const [page, setPage] =
    useState(1);

  const [perPage, setPerPage] =
    useState(5);

  const [user, setUser] =
    useState<User | null>(null);

  const [
    selectedReminder,
    setSelectedReminder,
  ] =
    useState<Reminder | null>(
      null
    );

  /* =========================
     LOAD CURRENT USER
  ========================= */

  const loadUser =
    async () => {
      try {
        const res =
          await axios.get(
            "/api/auth/me"
          );

        setUser(res.data);

      } catch (err) {
        console.error(err);
      }
    };

  /* =========================
     LOAD REMINDERS
  ========================= */

  const loadReminders =
    async () => {
      try {
        setLoading(true);

        const res =
          await axios.get(
            "/api/reminders"
          );

        const reminders =
          Array.isArray(
            res.data
          )
            ? res.data
            : res.data.data || [];

        setData(reminders);

      } catch (err) {
        console.error(err);

      } finally {
        setLoading(false);
      }
    };

  /* =========================
     INITIAL LOAD
  ========================= */

  useEffect(() => {
    loadUser();

    loadReminders();
  }, []);

  /* =========================
     FILTER REMINDERS
  ========================= */

  const filtered =
    useMemo(() => {
      let result = [...data];

      /* ONLY CURRENT USER */

      if (user?.id) {
        result =
          result.filter(
            (r) =>
              r.userId ===
              user.id
          );
      }

      /* SEARCH */

      if (search) {
        result =
          result.filter((r) =>
            r.email
              .toLowerCase()
              .includes(
                search.toLowerCase()
              )
          );
      }

      /* MODE */

      if (
        mode !== "all"
      ) {
        result =
          result.filter(
            (r) =>
              r.mode ===
              mode
          );
      }

      /* NEWEST FIRST */

      result.sort(
        (a, b) =>
          new Date(
            b.sentAt
          ).getTime() -
          new Date(
            a.sentAt
          ).getTime()
      );

      return result;
    }, [
      data,
      search,
      mode,
      user,
    ]);

  /* =========================
     PAGINATION
  ========================= */

  const totalPages =
    Math.ceil(
      filtered.length /
        perPage
    ) || 1;

  const start =
    (page - 1) * perPage;

  const paginated =
    filtered.slice(
      start,
      start + perPage
    );

  /* =========================
     RESET PAGE
  ========================= */

  useEffect(() => {
    setPage(1);
  }, [
    search,
    mode,
    perPage,
  ]);

  /* =========================
     STYLES
  ========================= */

  const statusStyle = (
    status: string
  ) => {
    switch (
      status?.toLowerCase()
    ) {
      case "sent":
        return "bg-green-100 text-green-700";

      case "failed":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const modeStyle = (
    mode: string
  ) => {
    return mode === "auto"
      ? "bg-purple-100 text-purple-700"
      : "bg-blue-100 text-blue-700";
  };

  /* =========================
     UI
  ========================= */

  return (
    <Layout>
      <div className="space-y-6">

        {/* HEADER */}

        <div className="flex items-center justify-between">

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Reminders
            </h1>

            <p className="text-gray-500 mt-1">
              View reminders sent by you
            </p>
          </div>

          <a
            href="/products/invoice-recovery/reminders/create"
            className="bg-black hover:bg-gray-900 text-white px-5 py-3 rounded-xl text-sm font-medium transition"
          >
            + Send Reminder
          </a>

        </div>

        {/* FILTER BAR */}

        <div className="flex flex-wrap gap-4 items-center justify-between">

          {/* SEARCH */}

          <div className="flex-1 min-w-[240px]">

            <input
              placeholder="Search email..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
            />

          </div>

          {/* MODE FILTER */}

          <div className="flex bg-gray-100 p-1 rounded-xl">

            {[
              "all",
              "manual",
              "auto",
            ].map((m) => (
              <button
                key={m}
                onClick={() =>
                  setMode(
                    m as any
                  )
                }
                className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition ${
                  mode === m
                    ? "bg-black text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                {m}
              </button>
            ))}

          </div>

          {/* PER PAGE */}

          <select
            value={perPage}
            onChange={(e) =>
              setPerPage(
                Number(
                  e.target.value
                )
              )
            }
            className="border border-gray-300 rounded-xl px-3 py-3 outline-none"
          >
            <option value={5}>
              5
            </option>

            <option value={10}>
              10
            </option>

            <option value={25}>
              25
            </option>
          </select>

        </div>

        {/* TABLE */}

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

          {loading ? (
            <div className="p-10 text-center text-gray-500">
              Loading reminders...
            </div>

          ) : filtered.length ===
            0 ? (
            <div className="p-10 text-center">

              <p className="text-gray-500">
                No reminders found
              </p>

            </div>

          ) : (
            <>
              <table className="w-full text-sm">

                <thead className="bg-gray-50 text-gray-600">

                  <tr>

                    <th className="px-6 py-4 text-left font-semibold">
                      #
                    </th>

                    <th className="px-6 py-4 text-left font-semibold">
                      Email
                    </th>

                    <th className="px-6 py-4 text-left font-semibold">
                      Amount
                    </th>

                    <th className="px-6 py-4 text-left font-semibold">
                      Type
                    </th>

                    <th className="px-6 py-4 text-left font-semibold">
                      Mode
                    </th>

                    <th className="px-6 py-4 text-left font-semibold">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left font-semibold">
                      Date
                    </th>

                    <th className="px-6 py-4 text-left font-semibold">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {paginated.map(
                    (
                      reminder,
                      index
                    ) => (
                      <tr
                        key={
                          reminder.id
                        }
                        className="border-t border-gray-100 hover:bg-gray-50 transition"
                      >

                        <td className="px-6 py-4">
                          {start +
                            index +
                            1}
                        </td>

                        <td className="px-6 py-4 font-medium text-gray-900">
                          {
                            reminder.email
                          }
                        </td>

                        <td className="px-6 py-4 font-semibold">
                          $
                          {
                            reminder.amount
                          }
                        </td>

                        <td className="px-6 py-4 capitalize">
                          {
                            reminder.type
                          }
                        </td>

                        <td className="px-6 py-4">

                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${modeStyle(
                              reminder.mode
                            )}`}
                          >
                            {
                              reminder.mode
                            }
                          </span>

                        </td>

                        <td className="px-6 py-4">

                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusStyle(
                              reminder.status
                            )}`}
                          >
                            {
                              reminder.status
                            }
                          </span>

                        </td>

                        <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                          {new Date(
                            reminder.sentAt
                          ).toLocaleString()}
                        </td>

                        <td className="px-6 py-4">

                          <button
                            onClick={() =>
                              setSelectedReminder(
                                reminder
                              )
                            }
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2 rounded-lg transition"
                          >
                            View
                          </button>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

              {/* FOOTER */}

              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">

                <p className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-medium text-gray-900">
                    {
                      paginated.length
                    }
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-gray-900">
                    {
                      filtered.length
                    }
                  </span>{" "}
                  reminders
                </p>

                <div className="flex gap-2">

                  <button
                    disabled={
                      page === 1
                    }
                    onClick={() =>
                      setPage(
                        (
                          prev
                        ) =>
                          prev -
                          1
                      )
                    }
                    className="border border-gray-300 px-4 py-2 rounded-lg text-sm disabled:opacity-40"
                  >
                    Prev
                  </button>

                  <button
                    disabled={
                      page ===
                      totalPages
                    }
                    onClick={() =>
                      setPage(
                        (
                          prev
                        ) =>
                          prev +
                          1
                      )
                    }
                    className="border border-gray-300 px-4 py-2 rounded-lg text-sm disabled:opacity-40"
                  >
                    Next
                  </button>

                </div>

              </div>
            </>
          )}
        </div>

        {/* EMAIL MODAL */}

        <EmailViewerModal
          isOpen={
            !!selectedReminder
          }
          onClose={() =>
            setSelectedReminder(
              null
            )
          }
          email={
            selectedReminder?.email ||
            ""
          }
          html={
            selectedReminder?.html ||
            "<p>No content</p>"
          }
          date={
            selectedReminder?.sentAt ||
            ""
          }
        />

      </div>
    </Layout>
  );
}