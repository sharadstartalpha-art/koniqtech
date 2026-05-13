"use client";

import { useEffect, useState } from "react";

import axios from "axios";

import toast from "react-hot-toast";

import {
  CreditCard,
  Landmark,
  Wallet,
  Plus,
  CheckCircle2,
  Copy,
  Save,
  Loader2,
} from "lucide-react";

type PaymentSettings = {
  paypalMe?: string | null;

  stripeLink?: string | null;

  razorpayLink?: string | null;

  bankName?: string | null;

  accountName?: string | null;

  accountNumber?: string | null;

  ifscCode?: string | null;

  upiId?: string | null;

  customPaymentLink?: string | null;
};

export default function PaymentMethodsPage() {

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [data, setData] =
    useState<PaymentSettings>({
      paypalMe: "",

      stripeLink: "",

      razorpayLink: "",

      bankName: "",

      accountName: "",

      accountNumber: "",

      ifscCode: "",

      upiId: "",

      customPaymentLink: "",
    });

  /* =========================================
     LOAD
  ========================================= */

  const loadSettings =
    async () => {
      try {

        const res =
          await axios.get(
            "/api/settings/payments"
          );

        if (res.data) {
          setData({
            ...data,
            ...res.data,
          });
        }

      } catch (err) {

        console.error(err);

        toast.error(
          "Failed to load payment settings"
        );

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {
    loadSettings();
  }, []);

  /* =========================================
     UPDATE
  ========================================= */

  const updateField = (
    field: keyof PaymentSettings,
    value: string
  ) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* =========================================
     SAVE
  ========================================= */

  const saveSettings =
    async () => {
      try {

        setSaving(true);

        await axios.post(
          "/api/settings/payments",
          data
        );

        toast.success(
          "Payment settings updated"
        );

      } catch (err) {

        console.error(err);

        toast.error(
          "Failed to save payment settings"
        );

      } finally {

        setSaving(false);
      }
    };

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <div className="p-10">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* =====================================
         HEADER
      ===================================== */}

      <div className="
        rounded-3xl
        bg-gradient-to-r
        from-black
        to-zinc-900
        text-white
        p-8
      ">

        <div className="
          flex items-start justify-between
          flex-wrap gap-5
        ">

          <div>

            <div className="
              inline-flex
              items-center
              gap-2
              px-3 py-1
              rounded-full
              bg-white/10
              text-xs
              mb-5
            ">

              <Wallet size={14} />

              Payment Recovery

            </div>

            <h1 className="
              text-4xl
              font-bold
            ">

              Payment Methods

            </h1>

            <p className="
              text-zinc-300
              mt-4
              max-w-2xl
              leading-7
            ">

              Configure your payment links and banking details.
              Recovery emails automatically include payment buttons
              when available.

            </p>

          </div>

          <button
            onClick={
              saveSettings
            }
            disabled={
              saving
            }
            className="
              h-12
              px-6
              rounded-2xl
              bg-white
              text-black
              font-semibold
              flex items-center gap-2
              disabled:opacity-60
            "
          >

            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}

          </button>

        </div>

      </div>

      {/* =====================================
         PAYMENT LINKS
      ===================================== */}

      <div className="
        bg-white
        border border-zinc-200
        rounded-3xl
        p-8
      ">

        <div className="mb-8">

          <h2 className="
            text-2xl
            font-bold
          ">

            Payment Links

          </h2>

          <p className="
            text-sm
            text-zinc-500
            mt-2
          ">

            Add payment links for instant invoice recovery.

          </p>

        </div>

        <div className="
          grid grid-cols-1
          md:grid-cols-2
          gap-5
        ">

          {/* PAYPAL */}

          <InputCard
            icon={Wallet}
            title="PayPal.me"
            placeholder="https://paypal.me/yourname"
            value={
              data.paypalMe || ""
            }
            onChange={(value) =>
              updateField(
                "paypalMe",
                value
              )
            }
          />

          {/* STRIPE */}

          <InputCard
            icon={CreditCard}
            title="Stripe Payment Link"
            placeholder="https://buy.stripe.com/..."
            value={
              data.stripeLink || ""
            }
            onChange={(value) =>
              updateField(
                "stripeLink",
                value
              )
            }
          />

          {/* RAZORPAY */}

          <InputCard
            icon={CreditCard}
            title="Razorpay Link"
            placeholder="https://rzp.io/..."
            value={
              data.razorpayLink || ""
            }
            onChange={(value) =>
              updateField(
                "razorpayLink",
                value
              )
            }
          />

          {/* CUSTOM */}

          <InputCard
            icon={Plus}
            title="Custom Payment Link"
            placeholder="https://yourwebsite.com/pay"
            value={
              data.customPaymentLink ||
              ""
            }
            onChange={(value) =>
              updateField(
                "customPaymentLink",
                value
              )
            }
          />

        </div>

      </div>

      {/* =====================================
         BANK DETAILS
      ===================================== */}

      <div className="
        bg-white
        border border-zinc-200
        rounded-3xl
        p-8
      ">

        <div className="mb-8">

          <h2 className="
            text-2xl
            font-bold
          ">

            Bank Details

          </h2>

          <p className="
            text-sm
            text-zinc-500
            mt-2
          ">

            These details can appear in recovery emails
            when no payment link exists.

          </p>

        </div>

        <div className="
          grid grid-cols-1
          md:grid-cols-2
          gap-5
        ">

          <InputCard
            icon={Landmark}
            title="Bank Name"
            placeholder="HDFC Bank"
            value={
              data.bankName || ""
            }
            onChange={(value) =>
              updateField(
                "bankName",
                value
              )
            }
          />

          <InputCard
            icon={Landmark}
            title="Account Name"
            placeholder="John Doe"
            value={
              data.accountName ||
              ""
            }
            onChange={(value) =>
              updateField(
                "accountName",
                value
              )
            }
          />

          <InputCard
            icon={Landmark}
            title="Account Number"
            placeholder="XXXX XXXX XXXX"
            value={
              data.accountNumber ||
              ""
            }
            onChange={(value) =>
              updateField(
                "accountNumber",
                value
              )
            }
          />

          <InputCard
            icon={Landmark}
            title="IFSC / SWIFT"
            placeholder="HDFC0000123"
            value={
              data.ifscCode || ""
            }
            onChange={(value) =>
              updateField(
                "ifscCode",
                value
              )
            }
          />

          <InputCard
            icon={Wallet}
            title="UPI ID"
            placeholder="name@upi"
            value={
              data.upiId || ""
            }
            onChange={(value) =>
              updateField(
                "upiId",
                value
              )
            }
          />

        </div>

      </div>

      {/* =====================================
         INFO
      ===================================== */}

      <div className="
        bg-green-50
        border border-green-200
        rounded-3xl
        p-6
      ">

        <div className="
          flex items-start gap-4
        ">

          <div className="
            w-12 h-12
            rounded-2xl
            bg-green-100
            flex items-center justify-center
            shrink-0
          ">

            <CheckCircle2 className="w-5 h-5 text-green-700" />

          </div>

          <div>

            <h3 className="
              font-semibold
              text-green-900
            ">

              Smart Recovery Behavior

            </h3>

            <div className="
              text-sm
              text-green-800
              mt-3
              leading-7
              space-y-2
            ">

              <p>
                • If payment link exists → recovery emails show payment button
              </p>

              <p>
                • If no payment link exists → plain reminder email is sent
              </p>

              <p>
                • Bank details can automatically appear as fallback
              </p>

              <p>
                • Auto recovery workflows use these payment methods automatically
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

/* =========================================
   INPUT CARD
========================================= */

function InputCard({
  icon: Icon,
  title,
  placeholder,
  value,
  onChange,
}: {
  icon: any;
  title: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {

  const copyValue = async () => {

    if (!value) return;

    await navigator.clipboard.writeText(
      value
    );

    toast.success(
      "Copied"
    );
  };

  return (
    <div className="
      border border-zinc-200
      rounded-3xl
      p-5
    ">

      <div className="
        flex items-center gap-3
        mb-4
      ">

        <div className="
          w-11 h-11
          rounded-2xl
          bg-zinc-100
          flex items-center justify-center
        ">

          <Icon size={18} />

        </div>

        <div>

          <h3 className="
            font-semibold
            text-zinc-900
          ">

            {title}

          </h3>

        </div>

      </div>

      <div className="relative">

        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) =>
            onChange(
              e.target.value
            )
          }
          className="
            w-full
            h-12
            border border-zinc-300
            rounded-2xl
            px-4
            pr-12
            outline-none
            focus:ring-4
            focus:ring-orange-100
            focus:border-orange-500
            transition
          "
        />

        {value && (
          <button
            onClick={
              copyValue
            }
            className="
              absolute
              right-4
              top-1/2
              -translate-y-1/2
              text-zinc-400
              hover:text-black
            "
          >

            <Copy size={16} />

          </button>
        )}

      </div>

    </div>
  );
}