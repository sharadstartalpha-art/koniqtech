"use client";

import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  DollarSign,
  Users,
  CreditCard,
  CheckCircle2,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Clock3,
} from "lucide-react";

export default function AdminDashboard() {
  const [data, setData] =
    useState<any>({});

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    axios
      .get("/api/admin/stats")
      .then((res) => {
        setData(
          res.data
        );
      })
      .finally(() =>
        setLoading(false)
      );
  }, []);

  const stats = [
    {
      title:
        "Total Revenue",
      value: `$${(
        data.revenue || 0
      ).toLocaleString()}`,
      icon:
        DollarSign,
      growth: "+18%",
      desc: "Revenue growth this month",
    },

    {
      title:
        "Total Users",
      value:
        data.users || 0,
      icon: Users,
      growth: "+12%",
      desc: "New users joined",
    },

    {
      title:
        "Active Subscriptions",
      value:
        data.subs || 0,
      icon:
        CreditCard,
      growth: "+9%",
      desc: "Currently active plans",
    },

    {
      title:
        "Invoices Paid",
      value:
        data.paid || 0,
      icon:
        CheckCircle2,
      growth: "+24%",
      desc: "Recovered invoices",
    },
  ];

  return (
    <div className="space-y-8">

      {/* HERO */}

      <div className="bg-gradient-to-r from-black to-gray-900 rounded-3xl p-8 text-white overflow-hidden relative">

        <div className="absolute right-0 top-0 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex items-start justify-between flex-wrap gap-6">

          <div>

            <p className="text-orange-400 text-sm font-medium mb-3">
              Welcome back 👋
            </p>

            <h1 className="text-4xl font-bold leading-tight">
              SaaS Admin Dashboard
            </h1>

            <p className="text-gray-300 mt-4 max-w-2xl leading-7">
              Monitor users, subscriptions,
              invoice recovery performance,
              revenue growth, and platform
              activity in real time.
            </p>

          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-5 min-w-[250px]">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-300">
                  Monthly Growth
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  +28%
                </h2>

              </div>

              <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center">

                <TrendingUp
                  size={26}
                />

              </div>

            </div>

            <p className="text-sm text-gray-400 mt-4">
              Compared to last month
            </p>

          </div>

        </div>

      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        {stats.map(
          (item) => {
            const Icon =
              item.icon;

            return (
              <div
                key={
                  item.title
                }
                className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-xl transition-all duration-300"
              >

                <div className="flex items-start justify-between">

                  <div>

                    <p className="text-sm text-gray-500">
                      {
                        item.title
                      }
                    </p>

                    <h2 className="text-3xl font-bold text-gray-900 mt-3">
                      {loading
                        ? "..."
                        : item.value}
                    </h2>

                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">

                    <Icon
                      size={
                        22
                      }
                    />

                  </div>

                </div>

                <div className="mt-6 flex items-center justify-between">

                  <div className="flex items-center gap-2 text-green-600 text-sm font-medium">

                    <ArrowUpRight
                      size={
                        16
                      }
                    />

                    {
                      item.growth
                    }

                  </div>

                  <p className="text-xs text-gray-400">
                    {
                      item.desc
                    }
                  </p>

                </div>

              </div>
            );
          }
        )}

      </div>

      {/* ANALYTICS GRID */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* PLATFORM ACTIVITY */}

        <div className="xl:col-span-2 bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">

          <div className="flex items-center justify-between mb-8">

            <div>

              <h3 className="text-xl font-bold text-gray-900">
                Platform Activity
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Live system overview
              </p>

            </div>

            <div className="flex items-center gap-2 text-sm text-green-600 font-medium">

              <div className="w-2 h-2 rounded-full bg-green-500" />

              Live

            </div>

          </div>

          <div className="space-y-5">

            <ActivityRow
              title="New User Registrations"
              value={`${data.users || 0} users`}
              percent="72%"
            />

            <ActivityRow
              title="Invoice Recovery Success"
              value={`${data.paid || 0} paid`}
              percent="64%"
            />

            <ActivityRow
              title="Subscription Conversion"
              value={`${data.subs || 0} active`}
              percent="81%"
            />

            <ActivityRow
              title="Revenue Performance"
              value={`$${data.revenue || 0}`}
              percent="91%"
            />

          </div>

        </div>

        {/* QUICK INSIGHTS */}

        <div className="space-y-6">

          {/* SYSTEM STATUS */}

          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">

            <div className="flex items-center gap-3 mb-5">

              <div className="w-11 h-11 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">

                <Activity
                  size={20}
                />

              </div>

              <div>

                <h3 className="font-semibold text-gray-900">
                  System Status
                </h3>

                <p className="text-xs text-gray-500">
                  Real-time monitoring
                </p>

              </div>

            </div>

            <div className="space-y-4">

              <StatusItem
                label="API Server"
                status="Operational"
                color="green"
              />

              <StatusItem
                label="Payments"
                status="Running"
                color="green"
              />

              <StatusItem
                label="Emails"
                status="Healthy"
                color="green"
              />

              <StatusItem
                label="Database"
                status="Stable"
                color="green"
              />

            </div>

          </div>

          {/* RECENT ACTIVITY */}

          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">

            <h3 className="font-semibold text-gray-900 mb-5">
              Recent Activity
            </h3>

            <div className="space-y-5">

              <RecentItem
                text="New subscription created"
                time="2 min ago"
              />

              <RecentItem
                text="Invoice payment recovered"
                time="12 min ago"
              />

              <RecentItem
                text="New user registered"
                time="35 min ago"
              />

              <RecentItem
                text="Reminder email delivered"
                time="1 hour ago"
              />

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

/* =========================
   ACTIVITY ROW
========================= */

function ActivityRow({
  title,
  value,
  percent,
}: any) {
  return (
    <div>

      <div className="flex items-center justify-between mb-2">

        <div>

          <p className="text-sm font-medium text-gray-700">
            {title}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            {value}
          </p>

        </div>

        <span className="text-sm font-semibold text-gray-900">
          {percent}
        </span>

      </div>

      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">

        <div
          style={{
            width: percent,
          }}
          className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
        />

      </div>

    </div>
  );
}

/* =========================
   STATUS ITEM
========================= */

function StatusItem({
  label,
  status,
  color,
}: any) {
  return (
    <div className="flex items-center justify-between">

      <p className="text-sm text-gray-600">
        {label}
      </p>

      <div className="flex items-center gap-2">

        <div
          className={`w-2 h-2 rounded-full ${
            color === "green"
              ? "bg-green-500"
              : "bg-yellow-500"
          }`}
        />

        <span className="text-sm font-medium text-gray-900">
          {status}
        </span>

      </div>

    </div>
  );
}

/* =========================
   RECENT ITEM
========================= */

function RecentItem({
  text,
  time,
}: any) {
  return (
    <div className="flex items-start gap-3">

      <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">

        <Clock3 size={18} />

      </div>

      <div>

        <p className="text-sm font-medium text-gray-800">
          {text}
        </p>

        <p className="text-xs text-gray-400 mt-1">
          {time}
        </p>

      </div>

    </div>
  );
}