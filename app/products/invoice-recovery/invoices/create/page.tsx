"use client";

import { useState, useEffect } from "react";

import axios from "axios";

import Layout from "@/components/Layout";

import toast from "react-hot-toast";

import {
  Mail,
  DollarSign,
  User,
  Sparkles,
  Phone,
  ShieldCheck,
  ArrowRight,
  Clock3,
  Wand2,
} from "lucide-react";

type ReminderStep = {
  day: number;

  type:
    | "friendly"
    | "firm"
    | "final";
};

export default function CreateInvoicePage() {

  /* =========================================
     CLIENT
  ========================================= */

  const [email, setEmail] =
    useState("");

  const [name, setName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [amount, setAmount] =
    useState("");

  /* =========================================
     MODE
  ========================================= */

  const [mode, setMode] =
    useState<
      "manual" | "auto"
    >("auto");

  /* =========================================
     AUTOMATION
  ========================================= */

  const [
    autoSendFirstReminder,
    setAutoSendFirstReminder,
  ] = useState(true);

  const [
    reminderWorkflow,
    setReminderWorkflow,
  ] = useState<
    ReminderStep[]
  >([
    {
      day: 3,
      type: "friendly",
    },

    {
      day: 7,
      type: "firm",
    },

    {
      day: 14,
      type: "final",
    },
  ]);

  /* =========================================
     LOADING
  ========================================= */

  const [loading, setLoading] =
    useState(false);

  /* =========================================
     PAYMENT WARNING
  ========================================= */

  const [
    showPaymentWarning,
    setShowPaymentWarning,
  ] = useState(false);

  const [
    hasPaymentMethod,
    setHasPaymentMethod,
  ] = useState(false);

  /* =========================================
     UPDATE WORKFLOW
  ========================================= */

  const updateReminder = (
    index: number,
    field:
      | "day"
      | "type",
    value: any
  ) => {

    const updated = [
      ...reminderWorkflow,
    ];

    updated[index] = {
      ...updated[index],

      [field]: value,
    };

    setReminderWorkflow(
      updated
    );
  };

  /* =========================================
     CHECK PAYMENT METHOD
  ========================================= */

  useEffect(() => {

    const checkPaymentMethod =
      async () => {
        try {

          const res =
            await axios.get(
              "/api/settings/payments"
            );

          const data =
            res.data;

          const exists =
            !!(
              data?.paypalMe ||
              data?.stripeLink ||
              data?.razorpayLink ||
              data?.customPaymentLink ||
              data?.upiId
            );

          setHasPaymentMethod(
            exists
          );

        } catch (err) {

          console.error(err);
        }
      };

    checkPaymentMethod();

  }, []);

  /* =========================================
     CREATE
  ========================================= */

  const create =
    async () => {

      if (
        !email ||
        !amount
      ) {

        toast.error(
          "Email and amount required"
        );

        return;
      }

      /* =====================================
         PAYMENT METHOD CHECK
      ===================================== */

      if (
        mode === "auto" &&
        !hasPaymentMethod
      ) {

        setShowPaymentWarning(
          true
        );

        return;
      }

      try {

        setLoading(true);

        await axios.post(
          "/api/invoices/create",
          {
            clientEmail:
              email,

            clientName:
              name || null,

            clientPhone:
              phone || null,

            amount:
              Number(amount),

            dueDate:
              new Date(),

            mode,

            autoSendFirstReminder,

            reminderWorkflow,
          }
        );

        toast.success(
          "Invoice created successfully"
        );

        window.location.href =
          "/products/invoice-recovery/invoices";

      } catch (err) {

        console.error(err);

        toast.error(
          "Failed to create invoice"
        );

      } finally {

        setLoading(false);
      }
    };

  return (
    <Layout>

      <div className="space-y-8">

        {/* =====================================
           HEADER
        ===================================== */}

        <div className="flex items-start justify-between flex-wrap gap-5">

          <div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-medium mb-4">

              <Sparkles size={14} />

              Smart Recovery Invoice

            </div>

            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">

              Create Invoice

            </h1>

            <p className="text-gray-500 mt-3 max-w-2xl leading-7">

              Create invoices, automate payment reminders,
              and recover unpaid invoices automatically.

            </p>

          </div>

          <div className="hidden lg:flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-5 py-4">

            <div className="w-11 h-11 rounded-2xl bg-green-100 flex items-center justify-center">

              <ShieldCheck className="w-5 h-5 text-green-600" />

            </div>

            <div>

              <p className="text-sm font-semibold text-gray-900">

                Recovery Enabled

              </p>

              <p className="text-xs text-gray-500 mt-1">

                Email + WhatsApp + SMS automation ready

              </p>

            </div>

          </div>

        </div>

        {/* =====================================
           MAIN
        ===================================== */}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* =====================================
             FORM
          ===================================== */}

          <div className="xl:col-span-2 bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">

            {/* =====================================
               CLIENT INFO
            ===================================== */}

            <div className="p-8 border-b border-gray-100">

              <div className="mb-6">

                <h2 className="text-xl font-semibold text-gray-900">

                  Client Information

                </h2>

                <p className="text-sm text-gray-500 mt-1">

                  Add customer billing details

                </p>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* NAME */}

                <div>

                  <label className="text-sm font-medium text-gray-700 mb-2 block">

                    Client Name

                  </label>

                  <div className="relative">

                    <User className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />

                    <input
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) =>
                        setName(
                          e.target.value
                        )
                      }
                      className="w-full h-12 border border-gray-300 rounded-2xl pl-11 pr-4 outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition"
                    />

                  </div>

                </div>

                {/* EMAIL */}

                <div>

                  <label className="text-sm font-medium text-gray-700 mb-2 block">

                    Client Email

                  </label>

                  <div className="relative">

                    <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />

                    <input
                      type="email"
                      placeholder="client@email.com"
                      value={email}
                      onChange={(e) =>
                        setEmail(
                          e.target.value
                        )
                      }
                      className="w-full h-12 border border-gray-300 rounded-2xl pl-11 pr-4 outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition"
                    />

                  </div>

                </div>

                {/* PHONE */}

                <div>

                  <label className="text-sm font-medium text-gray-700 mb-2 block">

                    Client Phone

                  </label>

                  <div className="relative">

                    <Phone className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />

                    <input
                      type="text"
                      placeholder="+1 555 000 000"
                      value={phone}
                      onChange={(e) =>
                        setPhone(
                          e.target.value
                        )
                      }
                      className="w-full h-12 border border-gray-300 rounded-2xl pl-11 pr-4 outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition"
                    />

                  </div>

                </div>

                {/* AMOUNT */}

                <div>

                  <label className="text-sm font-medium text-gray-700 mb-2 block">

                    Invoice Amount

                  </label>

                  <div className="relative">

                    <DollarSign className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />

                    <input
                      type="number"
                      placeholder="1000"
                      value={amount}
                      onChange={(e) =>
                        setAmount(
                          e.target.value
                        )
                      }
                      className="w-full h-12 border border-gray-300 rounded-2xl pl-11 pr-4 outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition"
                    />

                  </div>

                </div>

              </div>

            </div>

            {/* =====================================
               RECOVERY MODE
            ===================================== */}

            <div className="p-8 border-b border-gray-100">

              <div className="mb-6">

                <h2 className="text-xl font-semibold text-gray-900">

                  Recovery Workflow

                </h2>

                <p className="text-sm text-gray-500 mt-1">

                  Configure automated recovery reminders

                </p>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* MANUAL */}

                <button
                  onClick={() =>
                    setMode("manual")
                  }
                  className={`border rounded-3xl p-6 text-left transition-all ${
                    mode === "manual"
                      ? "border-orange-500 bg-orange-50 ring-4 ring-orange-100"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >

                  <h3 className="font-semibold text-lg text-gray-900">

                    Manual Recovery

                  </h3>

                  <p className="text-sm text-gray-500 mt-3 leading-6">

                    Send reminders manually from dashboard.

                  </p>

                </button>

                {/* AUTO */}

                <button
                  onClick={() =>
                    setMode("auto")
                  }
                  className={`border rounded-3xl p-6 text-left transition-all ${
                    mode === "auto"
                      ? "border-orange-500 bg-orange-50 ring-4 ring-orange-100"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >

                  <h3 className="font-semibold text-lg text-gray-900">

                    Auto Recovery

                  </h3>

                  <p className="text-sm text-gray-500 mt-3 leading-6">

                    Fully automated smart recovery workflow.

                  </p>

                </button>

              </div>

            </div>

            {/* =====================================
               AUTOMATION SETTINGS
            ===================================== */}

            {mode === "auto" && (

              <div className="p-8 border-b border-gray-100">

                <div className="flex items-center gap-3 mb-6">

                  <Wand2 className="w-5 h-5 text-orange-500" />

                  <div>

                    <h2 className="text-xl font-semibold text-gray-900">

                      Automation Settings

                    </h2>

                    <p className="text-sm text-gray-500 mt-1">

                      Configure automatic reminder timeline

                    </p>

                  </div>

                </div>

                {/* FIRST MAIL */}

                <div className="bg-orange-50 border border-orange-200 rounded-3xl p-5 mb-6">

                  <div className="flex items-center justify-between gap-4">

                    <div>

                      <h3 className="font-semibold text-gray-900">

                        Instant First Reminder

                      </h3>

                      <p className="text-sm text-gray-500 mt-1">

                        Automatically send first email instantly after invoice creation

                      </p>

                    </div>

                    <input
                      type="checkbox"
                      checked={
                        autoSendFirstReminder
                      }
                      onChange={(e) =>
                        setAutoSendFirstReminder(
                          e.target.checked
                        )
                      }
                      className="w-5 h-5"
                    />

                  </div>

                </div>

                {/* WORKFLOW */}

                <div className="space-y-5">

                  {reminderWorkflow.map(
                    (
                      reminder,
                      index
                    ) => (

                      <div
                        key={index}
                        className="border border-gray-200 rounded-3xl p-5"
                      >

                        <div className="flex items-center gap-2 mb-5">

                          <Clock3 className="w-4 h-4 text-orange-500" />

                          <h3 className="font-semibold text-gray-900">

                            Reminder {index + 2}

                          </h3>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                          {/* DAYS */}

                          <div>

                            <label className="text-sm font-medium text-gray-700 mb-2 block">

                              Send After Days

                            </label>

                            <input
                              type="number"
                              min={1}
                              value={
                                reminder.day
                              }
                              onChange={(e) =>
                                updateReminder(
                                  index,
                                  "day",
                                  Number(
                                    e.target
                                      .value
                                  )
                                )
                              }
                              className="w-full h-12 border border-gray-300 rounded-2xl px-4 outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500"
                            />

                          </div>

                          {/* TYPE */}

                          <div>

                            <label className="text-sm font-medium text-gray-700 mb-2 block">

                              Reminder Type

                            </label>

                            <select
                              value={
                                reminder.type
                              }
                              onChange={(e) =>
                                updateReminder(
                                  index,
                                  "type",
                                  e.target
                                    .value
                                )
                              }
                              className="w-full h-12 border border-gray-300 rounded-2xl px-4 outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500"
                            >

                              <option value="friendly">

                                Friendly

                              </option>

                              <option value="firm">

                                Firm

                              </option>

                              <option value="final">

                                Final Notice

                              </option>

                            </select>

                          </div>

                        </div>

                      </div>
                    )
                  )}

                </div>

              </div>
            )}

            {/* =====================================
               FOOTER
            ===================================== */}

            <div className="px-8 py-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between">

              <a
                href="/products/invoice-recovery/invoices"
                className="text-sm font-medium text-gray-500 hover:text-gray-700 transition"
              >

                Cancel

              </a>

              <button
                onClick={create}
                disabled={loading}
                className="h-12 px-7 rounded-2xl bg-black hover:bg-gray-900 text-white font-semibold transition disabled:opacity-60 flex items-center gap-2"
              >

                {loading
                  ? "Creating..."
                  : "Create Invoice"}

                {!loading && (
                  <ArrowRight className="w-4 h-4" />
                )}

              </button>

            </div>

          </div>

          {/* =====================================
             SIDE PANEL
          ===================================== */}

          <div className="space-y-5">

            <div className="bg-black text-white rounded-3xl p-6 overflow-hidden relative">

              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl" />

              <div className="relative z-10">

                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-5">

                  <Sparkles className="w-5 h-5 text-yellow-300" />

                </div>

                <h3 className="text-xl font-semibold">

                  AI Recovery Automation

                </h3>

                <p className="text-sm text-gray-300 leading-7 mt-4">

                  Your reminders will automatically escalate from friendly to final notice.

                </p>

                <div className="mt-5 space-y-3 text-sm">

                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    Instant first reminder
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-400" />
                    Auto escalation workflow
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    Smart recovery sequences
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {showPaymentWarning && (

        <div className="
          fixed inset-0 z-50
          bg-black/50
          backdrop-blur-sm
          flex items-center justify-center
          p-4
        ">

          <div className="
            bg-white
            w-full
            max-w-lg
            rounded-3xl
            p-8
          ">

            <div className="
              w-14 h-14
              rounded-2xl
              bg-orange-100
              flex items-center justify-center
              mb-5
            ">

              <DollarSign className="w-6 h-6 text-orange-600" />

            </div>

            <h2 className="
              text-2xl
              font-bold
              text-gray-900
            ">

              No Payment Method Found

            </h2>

            <p className="
              text-gray-500
              mt-4
              leading-7
            ">

              You haven't configured any payment link yet.

              Customers will receive plain reminders without
              a payment button which may reduce recovery rates.

            </p>

            <div className="
              mt-6
              bg-orange-50
              border border-orange-200
              rounded-2xl
              p-4
            ">

              <p className="
                text-sm
                text-orange-800
                leading-6
              ">

                Recommended:
                Add PayPal, Stripe, Razorpay or UPI
                payment links before enabling
                auto recovery.

              </p>

            </div>

            <div className="
              flex flex-col md:flex-row
              gap-3
              mt-8
            ">

              {/* GO TO PAYMENT SETTINGS */}

              <button
                onClick={() => {
                  window.location.href =
                    "/products/invoice-recovery/settings/payment-methods";
                }}
                className="
                  flex-1
                  h-12
                  rounded-2xl
                  bg-black
                  text-white
                  font-semibold
                  flex items-center justify-center gap-2
                "
              >

                Configure Payment Link

                <ArrowRight className="w-4 h-4" />

              </button>

              {/* CONTINUE */}

              <button
                onClick={async () => {

                  setShowPaymentWarning(
                    false
                  );

                  try {

                    setLoading(true);

                    await axios.post(
                      "/api/invoices/create",
                      {
                        clientEmail:
                          email,

                        clientName:
                          name || null,

                        clientPhone:
                          phone || null,

                        amount:
                          Number(amount),

                        dueDate:
                          new Date(),

                        mode,

                        autoSendFirstReminder,

                        reminderWorkflow,
                      }
                    );

                    toast.success(
                      "Invoice created"
                    );

                    window.location.href =
                      "/products/invoice-recovery/invoices";

                  } catch (err) {

                    console.error(err);

                    toast.error(
                      "Failed to create invoice"
                    );

                  } finally {

                    setLoading(false);
                  }
                }}
                className="
                  flex-1
                  h-12
                  rounded-2xl
                  border border-gray-300
                  font-semibold
                "
              >

                Continue Without Payment Link

              </button>

            </div>

          </div>

        </div>
      )}

    </Layout>
  );
}