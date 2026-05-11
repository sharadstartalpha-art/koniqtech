"use client";

import { useState } from "react";

import axios from "axios";

import toast from "react-hot-toast";

import Layout from "@/components/Layout";

import {
  Workflow,
  ArrowRight,
  Plus,
} from "lucide-react";

export default function SetupWorkflowPage() {

  const [steps, setSteps] =
    useState([
      {
        delayDays: 1,
        tone: "friendly",
      },
    ]);

  const [loading, setLoading] =
    useState(false);

  const addStep = () => {

    setSteps([
      ...steps,
      {
        delayDays: 3,
        tone: "firm",
      },
    ]);
  };

  const saveWorkflow =
    async () => {

      try {

        setLoading(true);

        await axios.post(
          "/api/onboarding/setup-workflow",
          {
            steps,
          }
        );

        toast.success(
          "Workflow saved"
        );

        window.location.href =
          "/products/invoice-recovery/onboarding";

      } catch (err) {

        console.error(err);

        toast.error(
          "Failed to save workflow"
        );

      } finally {

        setLoading(false);
      }
    };

  return (
    <Layout>

      <div className="min-h-screen bg-gray-50 px-6 py-10">

        <div className="max-w-3xl mx-auto">

          <div className="mb-8 flex items-center gap-4">

            <div className="w-14 h-14 rounded-3xl bg-orange-100 flex items-center justify-center">

              <Workflow className="w-7 h-7 text-orange-600" />

            </div>

            <div>

              <h1 className="text-4xl font-bold text-gray-900">
                Setup Recovery Workflow
              </h1>

              <p className="text-gray-500 mt-2">
                Configure automated reminder steps.
              </p>

            </div>

          </div>

          <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden">

            <div className="p-8 space-y-5">

              {steps.map(
                (
                  step,
                  index
                ) => (
                  <div
                    key={index}
                    className="border rounded-2xl p-5"
                  >

                    <h3 className="font-semibold mb-4">
                      Step {index + 1}
                    </h3>

                    <div className="grid grid-cols-2 gap-4">

                      <input
                        type="number"
                        value={
                          step.delayDays
                        }
                        onChange={(e) => {

                          const updated =
                            [...steps];

                          updated[index]
                            .delayDays =
                            Number(
                              e.target.value
                            );

                          setSteps(
                            updated
                          );
                        }}
                        className="h-12 border rounded-2xl px-4"
                        placeholder="Delay days"
                      />

                      <select
                        value={
                          step.tone
                        }
                        onChange={(e) => {

                          const updated =
                            [...steps];

                          updated[index]
                            .tone =
                            e.target.value;

                          setSteps(
                            updated
                          );
                        }}
                        className="h-12 border rounded-2xl px-4"
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
                )
              )}

              <button
                onClick={addStep}
                className="flex items-center gap-2 text-sm font-medium"
              >

                <Plus className="w-4 h-4" />

                Add Step

              </button>

            </div>

            <div className="px-8 py-6 border-t bg-gray-50 flex justify-end">

              <button
                onClick={saveWorkflow}
                disabled={loading}
                className="h-12 px-6 rounded-2xl bg-black text-white font-semibold flex items-center gap-2"
              >

                {loading
                  ? "Saving..."
                  : "Save Workflow"}

                <ArrowRight className="w-4 h-4" />

              </button>

            </div>

          </div>

        </div>

      </div>

    </Layout>
  );
}