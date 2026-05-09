"use client";

import { useEffect, useState } from "react";

import axios from "axios";

import Layout from "@/components/Layout";

import toast from "react-hot-toast";

import {
  Bot,
  Mail,
  MessageSquare,
  Smartphone,
  Clock3,
  CheckCircle2,
  ArrowRight,
  Plus,
  X,
} from "lucide-react";

/* =========================
   TYPES
========================= */

type Workflow = {
  step: number;
  delay: number;
  channel: string;
  type: string;
  templateId?: string;
};

export default function AutomationPage() {
  const [loading, setLoading] =
    useState(false);

  const [showModal, setShowModal] =
    useState(false);

  const [invoiceId, setInvoiceId] =
    useState("");

  const [workflows, setWorkflows] =
    useState<Workflow[]>([
      {
        step: 1,
        delay: 1,
        channel: "email",
        type: "friendly",
      },
    ]);

  /* =========================
     LOAD EXISTING
  ========================= */

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      await axios.get(
        "/api/automation"
      );
    } catch {
      toast.error(
        "Failed to load automation"
      );
    }
  };

  /* =========================
     ADD STEP
  ========================= */

  const addStep = () => {
    setWorkflows([
      ...workflows,

      {
        step:
          workflows.length + 1,
        delay: 1,
        channel: "email",
        type: "friendly",
      },
    ]);
  };

  /* =========================
     UPDATE STEP
  ========================= */

  const updateStep = (
    index: number,
    field: keyof Workflow,
    value: any
  ) => {
    const updated = [
      ...workflows,
    ];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setWorkflows(updated);
  };

  /* =========================
     REMOVE STEP
  ========================= */

  const removeStep = (
    index: number
  ) => {
    const updated =
      workflows.filter(
        (_, i) => i !== index
      );

    setWorkflows(updated);
  };

  /* =========================
     SAVE
  ========================= */

  const saveWorkflow =
    async () => {
      if (!invoiceId) {
        return toast.error(
          "Invoice ID required"
        );
      }

      try {
        setLoading(true);

        await axios.post(
          "/api/automation",
          {
            invoiceId,
            workflows,
          }
        );

        toast.success(
          "Workflow created"
        );

        setShowModal(false);

      } catch {
        toast.error(
          "Failed to save workflow"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <Layout>
      <div className="space-y-8">

        {/* HERO */}

        <div className="bg-gradient-to-br from-black to-gray-900 rounded-3xl p-8 text-white relative overflow-hidden">

          <div className="absolute right-0 top-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />

          <div className="relative z-10">

            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2 rounded-full text-sm mb-5">

              <Bot size={16} />

              AI Recovery Automation

            </div>

            <h1 className="text-4xl font-bold leading-tight max-w-3xl">

              Put your invoice recovery
              on autopilot

            </h1>

            <p className="text-gray-300 mt-4 text-lg leading-8 max-w-2xl">

              Automatically recover unpaid invoices using intelligent reminders via Email, WhatsApp, and SMS.

            </p>

            <div className="flex gap-3 mt-8">

              <button
                onClick={() =>
                  setShowModal(true)
                }
                className="bg-white text-black px-5 py-3 rounded-2xl font-semibold hover:opacity-90 transition"
              >

                Create Workflow

              </button>

              <button className="border border-white/20 px-5 py-3 rounded-2xl font-semibold hover:bg-white/10 transition">

                View Analytics

              </button>

            </div>

          </div>

        </div>

        {/* STATS */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

          <StatCard
            title="Recovered Revenue"
            value="$12,480"
            subtitle="+18% this month"
          />

          <StatCard
            title="Active Workflows"
            value="3"
            subtitle="2 running"
          />

          <StatCard
            title="Reminders Sent"
            value="482"
            subtitle="Across all channels"
          />

          <StatCard
            title="Recovery Rate"
            value="74%"
            subtitle="Above industry average"
          />

        </div>

        {/* FLOW */}

        <div className="bg-white border rounded-3xl p-6">

          <div className="flex items-center justify-between mb-6">

            <div>

              <h2 className="text-xl font-semibold">
                Recovery Workflow
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Multi-step smart recovery automation
              </p>

            </div>

            <button
              onClick={() =>
                setShowModal(true)
              }
              className="border px-4 py-2 rounded-xl hover:bg-gray-50"
            >

              Edit Workflow

            </button>

          </div>

          <div className="space-y-5">

            {workflows.map(
              (item, index) => {

                const Icon =
                  item.channel ===
                  "email"
                    ? Mail
                    : item.channel ===
                      "whatsapp"
                    ? MessageSquare
                    : Smartphone;

                return (
                  <div
                    key={index}
                    className="flex items-center gap-4"
                  >

                    <div className="w-11 h-11 rounded-2xl bg-black text-white flex items-center justify-center font-semibold">

                      {item.step}

                    </div>

                    <div className="flex-1 border rounded-2xl p-5 flex items-center justify-between">

                      <div className="flex items-center gap-4">

                        <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">

                          <Icon size={22} />

                        </div>

                        <div>

                          <h3 className="font-semibold capitalize">

                            {item.channel}

                          </h3>

                          <p className="text-sm text-gray-500">

                            {item.delay} days •{" "}
                            {item.type}

                          </p>

                        </div>

                      </div>

                      <div className="flex items-center gap-2 text-green-600 text-sm font-medium">

                        <CheckCircle2
                          size={18}
                        />

                        Active

                      </div>

                    </div>

                    {index !==
                      workflows.length -
                        1 && (
                      <ArrowRight
                        size={18}
                        className="text-gray-400"
                      />
                    )}

                  </div>
                );
              }
            )}

          </div>

        </div>

        {/* MODAL */}

        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-5">

            <div className="bg-white w-full max-w-3xl rounded-3xl p-6 max-h-[90vh] overflow-y-auto">

              {/* HEADER */}

              <div className="flex items-center justify-between mb-6">

                <div>

                  <h2 className="text-2xl font-bold">
                    Create Workflow
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Configure automated recovery steps
                  </p>

                </div>

                <button
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center"
                >

                  <X size={20} />

                </button>

              </div>

              {/* INVOICE */}

              <div className="mb-6">

                <label className="text-sm font-medium block mb-2">

                  Invoice ID

                </label>

                <input
                  value={invoiceId}
                  onChange={(e) =>
                    setInvoiceId(
                      e.target.value
                    )
                  }
                  placeholder="Enter invoice ID"
                  className="w-full border rounded-2xl px-4 py-3"
                />

              </div>

              {/* STEPS */}

              <div className="space-y-4">

                {workflows.map(
                  (step, index) => (
                    <div
                      key={index}
                      className="border rounded-2xl p-5"
                    >

                      <div className="flex items-center justify-between mb-4">

                        <h3 className="font-semibold">

                          Step{" "}
                          {step.step}

                        </h3>

                        <button
                          onClick={() =>
                            removeStep(
                              index
                            )
                          }
                          className="text-red-500"
                        >

                          Remove

                        </button>

                      </div>

                      <div className="grid grid-cols-3 gap-4">

                        {/* DELAY */}

                        <div>

                          <label className="text-sm block mb-2">

                            Delay Days

                          </label>

                          <input
                            type="number"
                            value={
                              step.delay
                            }
                            onChange={(
                              e
                            ) =>
                              updateStep(
                                index,
                                "delay",
                                Number(
                                  e
                                    .target
                                    .value
                                )
                              )
                            }
                            className="w-full border rounded-xl px-3 py-2"
                          />

                        </div>

                        {/* CHANNEL */}

                        <div>

                          <label className="text-sm block mb-2">

                            Channel

                          </label>

                          <select
                            value={
                              step.channel
                            }
                            onChange={(
                              e
                            ) =>
                              updateStep(
                                index,
                                "channel",
                                e
                                  .target
                                  .value
                              )
                            }
                            className="w-full border rounded-xl px-3 py-2"
                          >

                            <option value="email">
                              Email
                            </option>

                            <option value="whatsapp">
                              WhatsApp
                            </option>

                            <option value="sms">
                              SMS
                            </option>

                          </select>

                        </div>

                        {/* TYPE */}

                        <div>

                          <label className="text-sm block mb-2">

                            Tone

                          </label>

                          <select
                            value={
                              step.type
                            }
                            onChange={(
                              e
                            ) =>
                              updateStep(
                                index,
                                "type",
                                e
                                  .target
                                  .value
                              )
                            }
                            className="w-full border rounded-xl px-3 py-2"
                          >

                            <option value="friendly">
                              Friendly
                            </option>

                            <option value="firm">
                              Firm
                            </option>

                            <option value="final">
                              Final Warning
                            </option>

                          </select>

                        </div>

                      </div>

                    </div>
                  )
                )}

              </div>

              {/* ADD */}

              <button
                onClick={addStep}
                className="mt-5 flex items-center gap-2 text-sm font-medium"
              >

                <Plus size={16} />

                Add Step

              </button>

              {/* FOOTER */}

              <div className="flex justify-end gap-3 mt-8">

                <button
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="border px-5 py-3 rounded-2xl"
                >

                  Cancel

                </button>

                <button
                  onClick={
                    saveWorkflow
                  }
                  disabled={loading}
                  className="bg-black text-white px-5 py-3 rounded-2xl"
                >

                  {loading
                    ? "Saving..."
                    : "Save Workflow"}

                </button>

              </div>

            </div>

          </div>
        )}

      </div>
    </Layout>
  );
}

/* =========================
   STAT CARD
========================= */

function StatCard({
  title,
  value,
  subtitle,
}: any) {
  return (
    <div className="bg-white border rounded-3xl p-5">

      <p className="text-sm text-gray-500">
        {title}
      </p>

      <h3 className="text-3xl font-bold mt-3">
        {value}
      </h3>

      <p className="text-sm text-green-600 mt-2">
        {subtitle}
      </p>

    </div>
  );
}