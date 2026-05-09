"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";
import toast from "react-hot-toast";

import {
  Link2,
  Copy,
  Trash2,
  ExternalLink,
  CreditCard,
  Plus,
} from "lucide-react";

/* =========================
   TYPES
========================= */

type LinkType = {
  id: string;
  title: string;
  url: string;
};

/* =========================
   PAGE
========================= */

export default function PaymentLinksPage() {
  const [links, setLinks] = useState<LinkType[]>([]);

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const [loading, setLoading] = useState(false);

  /* =========================
     LOAD LINKS
  ========================= */

  const load = async () => {
    try {
      const res = await axios.get(
        "/api/payment-links"
      );

      setLinks(res.data);

    } catch {
      toast.error(
        "Failed to load payment links"
      );
    }
  };

  useEffect(() => {
    load();
  }, []);

  /* =========================
     CREATE LINK
  ========================= */

  const create = async () => {
    if (!title || !url) {
      return toast.error(
        "Fill all fields"
      );
    }

    try {
      setLoading(true);

      await axios.post(
        "/api/payment-links",
        {
          title,
          url,
        }
      );

      toast.success(
        "Payment link created"
      );

      setTitle("");
      setUrl("");

      load();

    } catch {
      toast.error(
        "Failed to create link"
      );

    } finally {
      setLoading(false);
    }
  };

  /* =========================
     DELETE
  ========================= */

  const remove = async (
    id: string
  ) => {
    if (
      !confirm(
        "Delete this payment link?"
      )
    ) {
      return;
    }

    try {
      await axios.delete(
        `/api/payment-links?id=${id}`
      );

      toast.success(
        "Payment link deleted"
      );

      load();

    } catch {
      toast.error(
        "Delete failed"
      );
    }
  };

  /* =========================
     COPY
  ========================= */

  const copy = async (
    url: string
  ) => {
    await navigator.clipboard.writeText(
      url
    );

    toast.success("Copied!");
  };

  return (
    <Layout>
      <div className="space-y-8">

        {/* HEADER */}

        <div className="flex items-start justify-between flex-wrap gap-4">

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Payment Links
            </h1>

            <p className="text-gray-500 mt-2 max-w-2xl">
              Save and reuse Stripe,
              PayPal, Razorpay, Wise,
              or custom payment links
              inside invoices and
              reminder emails.
            </p>
          </div>

          <div className="bg-white border rounded-2xl px-5 py-4 min-w-[180px]">
            <p className="text-sm text-gray-500">
              Total Links
            </p>

            <h2 className="text-3xl font-bold mt-1">
              {links.length}
            </h2>
          </div>

        </div>

        {/* CREATE FORM */}

        <div className="bg-white border border-gray-200 rounded-3xl p-6">

          <div className="flex items-center gap-2 mb-5">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <Plus
                size={18}
                className="text-orange-600"
              />
            </div>

            <div>
              <h2 className="font-semibold text-gray-900">
                Add Payment Link
              </h2>

              <p className="text-sm text-gray-500">
                Store reusable payment
                destinations for clients.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">

            <input
              placeholder="Stripe / PayPal / Bank Transfer"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className="
                h-12 rounded-xl border
                border-gray-200 px-4
                outline-none
                focus:ring-2
                focus:ring-orange-500
              "
            />

            <input
              placeholder="https://..."
              value={url}
              onChange={(e) =>
                setUrl(e.target.value)
              }
              className="
                h-12 rounded-xl border
                border-gray-200 px-4
                outline-none
                focus:ring-2
                focus:ring-orange-500
              "
            />

          </div>

          <button
            onClick={create}
            disabled={loading}
            className="
              mt-5 h-11 px-6 rounded-xl
              bg-black text-white
              font-medium hover:opacity-90
              transition
            "
          >
            {loading
              ? "Creating..."
              : "Create Payment Link"}
          </button>

        </div>

        {/* LINKS */}

        {links.length === 0 ? (

          <div className="bg-white border border-dashed rounded-3xl p-14 text-center">

            <div className="w-16 h-16 rounded-2xl bg-gray-100 mx-auto flex items-center justify-center mb-5">
              <Link2
                size={28}
                className="text-gray-500"
              />
            </div>

            <h2 className="text-xl font-semibold text-gray-900">
              No payment links yet
            </h2>

            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              Add Stripe, PayPal,
              Razorpay, Wise or bank
              transfer links to quickly
              attach them to invoices
              and reminders.
            </p>

          </div>

        ) : (

          <div className="grid gap-4">

            {links.map((l) => (
              <div
                key={l.id}
                className="
                  bg-white border
                  border-gray-200
                  rounded-3xl p-5
                  flex items-center
                  justify-between
                  gap-4 flex-wrap
                "
              >

                {/* LEFT */}

                <div className="flex items-start gap-4">

                  <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center">
                    <CreditCard
                      size={20}
                      className="text-orange-600"
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {l.title}
                    </h3>

                    <a
                      href={l.url}
                      target="_blank"
                      className="
                        text-sm text-blue-600
                        hover:underline
                        break-all
                      "
                    >
                      {l.url}
                    </a>
                  </div>

                </div>

                {/* ACTIONS */}

                <div className="flex items-center gap-2">

                  <button
                    onClick={() =>
                      copy(l.url)
                    }
                    className="
                      h-10 px-4 rounded-xl
                      border border-gray-200
                      hover:bg-gray-50
                      flex items-center gap-2
                      text-sm
                    "
                  >
                    <Copy size={15} />
                    Copy
                  </button>

                  <a
                    href={l.url}
                    target="_blank"
                    className="
                      h-10 px-4 rounded-xl
                      border border-gray-200
                      hover:bg-gray-50
                      flex items-center gap-2
                      text-sm
                    "
                  >
                    <ExternalLink size={15} />
                    Open
                  </a>

                  <button
                    onClick={() =>
                      remove(l.id)
                    }
                    className="
                      h-10 px-4 rounded-xl
                      border border-red-200
                      text-red-600
                      hover:bg-red-50
                      flex items-center gap-2
                      text-sm
                    "
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </Layout>
  );
}