"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";

export default function DashboardPage() {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get("/api/dashboard/stats");
      setData(res.data);
    } catch (err) {
      console.error("Failed to load stats", err);
    }
  };

  const subscribe = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/payments/subscribe", {
        method: "POST",
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Payment error");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const isSubscribed = false; // 🔥 replace with DB later

  return (
    <Layout>
      <div>
        <h1 className="text-3xl font-bold mb-8">
          Dashboard
        </h1>

        {!isSubscribed ? (
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="mb-4 text-gray-600">
              You need a subscription to use this product.
            </p>

            <button
              onClick={subscribe}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
            >
              {loading ? "Redirecting..." : "Subscribe Now"}
            </button>
          </div>
        ) : (
          <>
            {/* 🔥 STATS CARDS */}
            <div className="grid grid-cols-3 gap-6">

              <Card
                title="Recovered"
                value={`$${data.recovered || 0}`}
                color="blue"
              />

              <Card
                title="Pending"
                value={`$${data.pending || 0}`}
                color="green"
              />

              <Card
                title="Invoices"
                value={data.count || 0}
                color="red"
              />
            </div>

            {/* 📊 ACTIVITY */}
            <div className="bg-white mt-6 p-6 rounded-xl shadow">
              <h2 className="mb-4 font-semibold">
                Recent Activity
              </h2>

              <p className="text-gray-500">
                Payments & reminders will show here
              </p>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

/* 🔥 CARD COMPONENT */
function Card({ title, value, color }: any) {
  const styles: any = {
    blue: "bg-blue-500 text-white",
    green: "bg-green-500 text-white",
    red: "bg-red-500 text-white",
  };

  return (
    <div className={`${styles[color]} p-6 rounded-xl shadow`}>
      <p className="text-sm opacity-80">{title}</p>
      <h2 className="text-3xl font-bold">{value}</h2>
    </div>
  );
}