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
  Receipt,
  TrendingUp,
  ArrowUpRight,
  Activity,
  BarChart3,
} from "lucide-react";

export default function AnalyticsPage() {
  const [data, setData] =
    useState({
      revenue: 0,
      users: 0,
      subs: 0,
      paid: 0,
    });

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res =
        await axios.get(
          "/api/admin/stats"
        );

      setData(res.data);

    } catch (err) {
      console.error(
        "Analytics load error:",
        err
      );

    } finally {
      setLoading(false);
    }
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">

        <div className="h-10 w-64 bg-gray-200 rounded-xl" />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

          {[1, 2, 3, 4].map(
            (i) => (
              <div
                key={i}
                className="bg-white rounded-3xl border border-gray-100 p-6 h-40"
              >
                <div className="h-4 bg-gray-200 rounded w-24 mb-5" />
                <div className="h-8 bg-gray-200 rounded w-28 mb-4" />
                <div className="h-3 bg-gray-200 rounded w-20" />
              </div>
            )
          )}

        </div>

      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* HERO */}

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-black via-gray-900 to-black p-8 text-white">

        <div className="absolute right-0 top-0 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

          <div>

            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2 rounded-full text-sm mb-5">

              <Activity size={16} />

              Platform Analytics

            </div>

            <h1 className="text-4xl font-bold tracking-tight">
              Business Insights
            </h1>

            <p className="text-gray-300 mt-4 max-w-2xl leading-7">
              Monitor revenue, subscriptions,
              customer growth, and overall
              SaaS performance from one
              powerful analytics dashboard.
            </p>

          </div>

          {/* QUICK SUMMARY */}

          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 min-w-[280px]">

            <p className="text-sm text-gray-300 mb-2">
              Monthly Growth
            </p>

            <div className="flex items-center gap-3">

              <h2 className="text-5xl font-bold">
                +24%
              </h2>

              <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm flex items-center gap-1">

                <ArrowUpRight size={14} />

                Growing

              </div>

            </div>

            <p className="text-sm text-gray-400 mt-4">
              Your SaaS metrics are improving
              steadily this month.
            </p>

          </div>

        </div>

      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <StatCard
          title="Total Revenue"
          value={`$${data.revenue}`}
          icon={DollarSign}
          growth="+12.5%"
          color="bg-green-100 text-green-600"
        />

        <StatCard
          title="Total Users"
          value={data.users}
          icon={Users}
          growth="+8.2%"
          color="bg-blue-100 text-blue-600"
        />

        <StatCard
          title="Active Subscriptions"
          value={data.subs}
          icon={CreditCard}
          growth="+18.4%"
          color="bg-purple-100 text-purple-600"
        />

        <StatCard
          title="Invoices Paid"
          value={data.paid}
          icon={Receipt}
          growth="+6.1%"
          color="bg-orange-100 text-orange-600"
        />

      </div>

      {/* ANALYTICS GRID */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* PERFORMANCE */}

        <div className="xl:col-span-2 bg-white border border-gray-100 rounded-3xl p-7 shadow-sm">

          <div className="flex items-center justify-between mb-8">

            <div>

              <h2 className="text-xl font-bold text-gray-900">
                Revenue Performance
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Revenue growth overview
              </p>

            </div>

            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-xl text-sm font-medium">

              <TrendingUp size={16} />

              +24% growth

            </div>

          </div>

          {/* MOCK CHART */}

          <div className="h-80 flex items-end gap-4">

            {[40, 65, 52, 80, 72, 95, 88, 100].map(
              (v, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-3"
                >

                  <div
                    className="w-full bg-gradient-to-t from-orange-500 to-orange-300 rounded-t-2xl transition-all hover:opacity-80"
                    style={{
                      height: `${v}%`,
                    }}
                  />

                  <span className="text-xs text-gray-400">
                    {
                      [
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                      ][i]
                    }
                  </span>

                </div>
              )
            )}

          </div>

        </div>

        {/* INSIGHTS */}

        <div className="bg-white border border-gray-100 rounded-3xl p-7 shadow-sm">

          <div className="flex items-center gap-3 mb-7">

            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">

              <BarChart3 size={22} />

            </div>

            <div>

              <h2 className="text-xl font-bold text-gray-900">
                Insights
              </h2>

              <p className="text-sm text-gray-500">
                Smart platform analytics
              </p>

            </div>

          </div>

          <div className="space-y-5">

            <Insight
              title="Revenue Growth"
              value="+24%"
              description="Revenue increased compared to last month."
            />

            <Insight
              title="User Retention"
              value="92%"
              description="Most users remain active after onboarding."
            />

            <Insight
              title="Subscription Rate"
              value="18%"
              description="Visitors converting into paid users."
            />

            <Insight
              title="Invoice Recovery"
              value="81%"
              description="Invoices successfully recovered."
            />

          </div>

        </div>

      </div>

      {/* ACTIVITY */}

      <div className="bg-white border border-gray-100 rounded-3xl p-7 shadow-sm">

        <div className="flex items-center justify-between mb-7">

          <div>

            <h2 className="text-xl font-bold text-gray-900">
              Platform Activity
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Latest business performance
            </p>

          </div>

          <button className="text-sm border border-gray-200 hover:bg-gray-50 px-4 py-2 rounded-xl transition">
            Export Report
          </button>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <ActivityCard
            title="MRR"
            value={`$${data.revenue}`}
            description="Monthly recurring revenue"
          />

          <ActivityCard
            title="Customer Growth"
            value={`${data.users}`}
            description="Total registered users"
          />

          <ActivityCard
            title="Recovery Success"
            value={`${data.paid}`}
            description="Invoices successfully paid"
          />

        </div>

      </div>

    </div>
  );
}

/* =========================
   STAT CARD
========================= */

function StatCard({
  title,
  value,
  icon: Icon,
  growth,
  color,
}: any) {
  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm text-gray-500 font-medium">
            {title}
          </p>

          <h2 className="text-4xl font-bold text-gray-900 mt-3">
            {value}
          </h2>

          <div className="inline-flex items-center gap-1 mt-4 bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm font-medium">

            <ArrowUpRight size={14} />

            {growth}

          </div>

        </div>

        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}
        >
          <Icon size={24} />
        </div>

      </div>

    </div>
  );
}

/* =========================
   INSIGHT
========================= */

function Insight({
  title,
  value,
  description,
}: any) {
  return (
    <div className="border border-gray-100 rounded-2xl p-5 hover:bg-gray-50 transition">

      <div className="flex items-center justify-between mb-2">

        <h3 className="font-semibold text-gray-900">
          {title}
        </h3>

        <span className="text-green-600 text-sm font-semibold">
          {value}
        </span>

      </div>

      <p className="text-sm text-gray-500 leading-6">
        {description}
      </p>

    </div>
  );
}

/* =========================
   ACTIVITY CARD
========================= */

function ActivityCard({
  title,
  value,
  description,
}: any) {
  return (
    <div className="border border-gray-100 rounded-2xl p-6 hover:shadow-md transition">

      <p className="text-sm text-gray-500 mb-3">
        {title}
      </p>

      <h2 className="text-3xl font-bold text-gray-900">
        {value}
      </h2>

      <p className="text-sm text-gray-500 mt-3 leading-6">
        {description}
      </p>

    </div>
  );
}