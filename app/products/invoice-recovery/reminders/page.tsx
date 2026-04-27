"use client";

import axios from "axios";
import Layout from "@/components/Layout";

export default function RemindersPage() {
  const sendNow = async () => {
    await axios.get("/api/reminders/send");
    alert("Reminders sent!");
  };

  return (
    <Layout>
      <div>
        <h1 className="text-2xl mb-6">Email Reminders</h1>

        <div className="bg-white p-6 rounded shadow">
          <p className="mb-4">
            Automatically send reminders for unpaid invoices.
          </p>

          <button
            onClick={sendNow}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Send Reminders Now
          </button>
        </div>
      </div>
    </Layout>
  );
}