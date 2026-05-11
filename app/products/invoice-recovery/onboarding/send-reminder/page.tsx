"use client";

import { useState } from "react";

import axios from "axios";

import toast from "react-hot-toast";

import Layout from "@/components/Layout";

import {
  Send,
  ArrowRight,
} from "lucide-react";

export default function SendReminderPage() {

  const [invoiceId, setInvoiceId] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const sendReminder =
    async () => {

      if (
        !invoiceId ||
        !email
      ) {

        toast.error(
          "Invoice ID and email required"
        );

        return;
      }

      try {

        setLoading(true);

        await axios.post(
          "/api/onboarding/send-reminder",
          {
            invoiceId,
            email,
            message,
          }
        );

        toast.success(
          "Reminder sent"
        );

        window.location.href =
          "/products/invoice-recovery/onboarding";

      } catch (err) {

        console.error(err);

        toast.error(
          "Failed to send reminder"
        );

      } finally {

        setLoading(false);
      }
    };

  return (
    <Layout>

      <div className="min-h-screen bg-gray-50 px-6 py-10">

        <div className="max-w-2xl mx-auto">

          <div className="mb-8 flex items-center gap-4">

            <div className="w-14 h-14 rounded-3xl bg-orange-100 flex items-center justify-center">

              <Send className="w-7 h-7 text-orange-600" />

            </div>

            <div>

              <h1 className="text-4xl font-bold text-gray-900">
                Send First Reminder
              </h1>

              <p className="text-gray-500 mt-2">
                Send your first recovery reminder manually.
              </p>

            </div>

          </div>

          <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden">

            <div className="p-8 space-y-6">

              <input
                placeholder="Invoice ID"
                value={invoiceId}
                onChange={(e) =>
                  setInvoiceId(
                    e.target.value
                  )
                }
                className="w-full h-12 border border-gray-300 rounded-2xl px-4"
              />

              <input
                type="email"
                placeholder="Client Email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                className="w-full h-12 border border-gray-300 rounded-2xl px-4"
              />

              <textarea
                rows={6}
                placeholder="Reminder message..."
                value={message}
                onChange={(e) =>
                  setMessage(
                    e.target.value
                  )
                }
                className="w-full border border-gray-300 rounded-2xl p-4"
              />

            </div>

            <div className="px-8 py-6 border-t bg-gray-50 flex justify-end">

              <button
                onClick={sendReminder}
                disabled={loading}
                className="h-12 px-6 rounded-2xl bg-black text-white font-semibold flex items-center gap-2"
              >

                {loading
                  ? "Sending..."
                  : "Send Reminder"}

                <ArrowRight className="w-4 h-4" />

              </button>

            </div>

          </div>

        </div>

      </div>

    </Layout>
  );
}