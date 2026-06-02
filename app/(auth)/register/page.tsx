"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function RegisterPage() {
const [name, setName] = useState("");
const [company, setCompany] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [crmType, setCrmType] = useState("roofing");
const [otp, setOtp] = useState("");
const [step, setStep] = useState(1);

const [sendingOtp, setSendingOtp] = useState(false);
const [registering, setRegistering] = useState(false);

async function sendOtp() {
if (!email.trim()) {
alert("Please enter your email");
return;
}


try {
  setSendingOtp(true);

  const res = await fetch("/api/auth/send-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Failed to send OTP");
    return;
  }

  setStep(2);
  alert("OTP sent");
} catch (error) {
  console.error(error);
  alert("Something went wrong");
} finally {
  setSendingOtp(false);
}


}

async function register() {
if (!otp.trim()) {
alert("Please enter OTP");
return;
}


try {
  setRegistering(true);

  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      company,
      email,
      password,
      otp,
      crmType,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Registration failed");
    return;
  }

  const redirectUrl = `/subscriptions/paypal?crm=${crmType}&company=${encodeURIComponent(
  company
)}&email=${encodeURIComponent(email)}`;

window.location.href = redirectUrl;
} catch (error) {
  console.error(error);
  alert("Something went wrong");
} finally {
  setRegistering(false);
}


}

return ( <div className="min-h-screen grid lg:grid-cols-2"> <div className="hidden lg:flex bg-black text-white items-center px-24"> <div> <div className="inline-flex gap-2 px-4 py-2 rounded-full bg-white/10"> <Sparkles size={16} />
CRM Platform </div>


      <h1 className="text-7xl font-bold mt-8">
        Create your
        <br />
        workspace
      </h1>

      <p className="text-slate-300 text-xl mt-8">
        Launch your CRM with subscriptions,
        AI and automation.
      </p>
    </div>
  </div>

  <div className="bg-slate-50 flex items-center justify-center p-10">
    <div className="w-full max-w-[560px] bg-white border rounded-[32px] p-12">
      <h1 className="text-4xl font-semibold">
        Create account
      </h1>

      <p className="text-slate-500 mt-3">
        Start your CRM workspace
      </p>

      <div className="space-y-4 mt-8">
        <input
          className="w-full h-14 px-5 rounded-2xl border bg-slate-50"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full h-14 px-5 rounded-2xl border bg-slate-50"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />

        <select
          value={crmType}
          onChange={(e) => setCrmType(e.target.value)}
          className="w-full h-14 px-5 rounded-2xl border bg-slate-50"
        >
          <option value="roofing">
            Roofing CRM ($199)
          </option>

          <option value="hvac">
            HVAC CRM ($199)
          </option>

          <option value="plumbing">
            Plumbing CRM ($199)
          </option>

          <option value="landscaping">
            Landscaping CRM ($199)
          </option>
        </select>

        <input
          type="email"
          className="w-full h-14 px-5 rounded-2xl border bg-slate-50"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full h-14 px-5 rounded-2xl border bg-slate-50"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {step === 1 ? (
          <button
            onClick={sendOtp}
            disabled={sendingOtp}
            className="
              w-full
              h-14
              bg-black
              text-white
              rounded-2xl
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            {sendingOtp ? "Sending..." : "Send OTP"}
          </button>
        ) : (
          <>
            <input
              className="w-full h-14 px-5 rounded-2xl border bg-slate-50"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              onClick={register}
              disabled={registering}
              className="
                w-full
                h-14
                bg-black
                text-white
                rounded-2xl
                flex
                items-center
                justify-center
                gap-2
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              {registering ? (
                "Creating Account..."
              ) : (
                <>
                  Continue
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </>
        )}
      </div>

      <div className="text-center mt-8 text-sm">
        Already have account?

        <Link
          href="/login"
          className="ml-2 font-medium"
        >
          Login
        </Link>
      </div>
    </div>
  </div>
</div>


);
}
