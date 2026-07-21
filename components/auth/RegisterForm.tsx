"use client";

import { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  Mail,
  Lock,
  User,
  Building2,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import FormInput from "./FormInput";
import LoadingButton from "./LoadingButton";
import PasswordStrength from "./PasswordStrength";
import IndustrySelector from "./IndustrySelector";
import OtpInput from "./OtpInput";
import StepIndicator from "./StepIndicator";

import {
  registerSchema,
  type RegisterSchema,
} from "@/shared/lib/validators/register";

export default function RegisterForm() {
  const router = useRouter();

  const [step, setStep] = useState(1);

  const [otp, setOtp] = useState("");

  const [sendingOtp, setSendingOtp] =
    useState(false);

  const [registering, setRegistering] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [secondsLeft, setSecondsLeft] =
    useState(0);

  const [apiError, setApiError] =
    useState("");

  const [apiSuccess, setApiSuccess] =
    useState("");

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    getValues,
    setValue,
    formState: {
      errors,
      isSubmitting,
      isValid,
    },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),

    mode: "onChange",

    defaultValues: {
      fullName: "",

      companyName: "",

      email: "",

      password: "",

      confirmPassword: "",

      otp: "",

      industry: "roofing",

      crmType: "roofing",

      phone: "",

      website: "",

      timezone: "UTC",

      currency: "USD",

      language: "en",

      plan: "starter",

      acceptTerms: false,
    },
  });

  const password = watch("password");

  const industry = watch("industry");

  const email = watch("email");

  const passwordStrength = useMemo(() => {
    let score = 0;

    if (password.length >= 8) score++;

    if (/[A-Z]/.test(password)) score++;

    if (/[a-z]/.test(password)) score++;

    if (/[0-9]/.test(password)) score++;

    if (/[^A-Za-z0-9]/.test(password))
      score++;

    return score;
  }, [password]);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((value) => value - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  async function goToOtpStep() {
  const valid = await trigger([
  "fullName",
  "companyName",
  "email",
  "password",
  "confirmPassword",
  "industry",
  "crmType",
  "acceptTerms",
]);

console.log("Form valid:", valid);

if (!valid) {
  console.log("Errors:", errors);
  return;
}

  setApiError("");
  setApiSuccess("");

  try {
    setSendingOtp(true);

    const response = await fetch(
      "/api/auth/send-otp",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          email,
        }),
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      setApiError(
        data.message ??
          "Unable to send verification code."
      );

      return;
    }

    setApiSuccess(
      "Verification code sent successfully."
    );

    setStep(2);

    setSecondsLeft(60);
  } catch {
    setApiError(
      "Unable to send verification code."
    );
  } finally {
    setSendingOtp(false);
  }
}


async function verifyAndRegister() {
  try {
    setRegistering(true);

    setApiError("");

    setApiSuccess("");

    const values = getValues();

    const response = await fetch(
      "/api/auth/register",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          ...values,

          otp,
        }),
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ??
          "Registration failed."
      );
    }

    setApiSuccess(
      "Workspace created successfully."
    );

    setStep(3);

    setTimeout(() => {
      router.push(
        `/checkout?plan=starter&email=${encodeURIComponent(
          values.email
        )}`
      );
    }, 2500);
  } catch (error) {
    setApiError(
      error instanceof Error
        ? error.message
        : "Registration failed."
    );
  } finally {
    setRegistering(false);
  }
}

const onSubmit = async () => {
  if (step === 1) {
    await goToOtpStep();

    return;
  }

  if (step === 2) {
    await verifyAndRegister();
  }
};

return (
  <form
    onSubmit={handleSubmit(onSubmit)}
    className="space-y-8"
    noValidate
  >
    <StepIndicator
  currentStep={step}
  steps={[
    {
      id: 1,
      title: "Account",
      description: "Create your workspace",
    },
    {
      id: 2,
      title: "Verification",
      description: "Verify your email",
    },
    {
      id: 3,
      title: "Complete",
      description: "Finish setup",
    },
  ]}
/>

    {apiError && (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
        <p className="text-sm font-medium text-red-700">
          {apiError}
        </p>
      </div>
    )}

    {apiSuccess && (
      <div className="rounded-xl border border-green-200 bg-green-50 p-4">
        <p className="text-sm font-medium text-green-700">
          {apiSuccess}
        </p>
      </div>
    )}

    {step === 1 && (
      <>

      <div className="space-y-2">
  <h2 className="text-3xl font-bold text-slate-900">
    Create Your Workspace
  </h2>

  <p className="text-slate-600">
    Create your KoniqTech account to start
    managing customers, jobs, dispatch,
    estimates, invoices and AI automation.
  </p>
</div>
<div className="grid gap-6 md:grid-cols-2">

  <FormInput
  label="Full Name"
  placeholder="John Smith"
  leftIcon={<User className="h-5 w-5" />}
  error={errors.fullName?.message}
  {...register("fullName")}
/>

<FormInput
  label="Company Name"
  placeholder="ABC Roofing LLC"
  leftIcon={<Building2 className="h-5 w-5" />}
  error={errors.companyName?.message}
  {...register("companyName")}
/>

<FormInput
  label="Business Email"
  type="email"
  placeholder="john@company.com"
  leftIcon={<Mail className="h-5 w-5" />}
  error={errors.email?.message}
  {...register("email")}
/>

<div className="space-y-3">
  <FormInput
    label="Password"
    type={
      showPassword
        ? "text"
        : "password"
    }
    placeholder="Create a secure password"
    leftIcon={<Lock className="h-5 w-5" />}
    error={errors.password?.message}
    {...register("password")}
  />

  <PasswordStrength
    password={password}
  />

  <button
    type="button"
    onClick={() =>
      setShowPassword(v => !v)
    }
    className="text-sm text-orange-600 hover:text-orange-700"
  >
    {showPassword
      ? "Hide Password"
      : "Show Password"}
  </button>
</div>
</div>

<div className="space-y-3">
  <FormInput
    label="Confirm Password"
    type={
      showConfirmPassword
        ? "text"
        : "password"
    }
    placeholder="Confirm your password"
    leftIcon={<Lock className="h-5 w-5" />}
    error={errors.confirmPassword?.message}
    {...register("confirmPassword")}
  />

  <button
    type="button"
    onClick={() =>
      setShowConfirmPassword(v => !v)
    }
    className="text-sm text-orange-600 hover:text-orange-700"
  >
    {showConfirmPassword
      ? "Hide Password"
      : "Show Password"}
  </button>

  {!errors.confirmPassword &&
    watch("confirmPassword") &&
    watch("confirmPassword") === password && (
      <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-3">
        <CheckCircle2 className="h-5 w-5 text-green-600" />

        <span className="text-sm font-medium text-green-700">
          Passwords match
        </span>
      </div>
    )}
</div>

<div className="space-y-3">
  <label className="text-sm font-semibold text-slate-700">
    Select Industry
  </label>

  <IndustrySelector
    value={industry}
    onChange={(value) => {
      setValue("industry", value, {
        shouldValidate: true,
      });

      setValue("crmType", value, {
        shouldValidate: true,
      });
    }}
  />

  {errors.industry && (
    <p className="text-sm text-red-600">
      {errors.industry.message}
    </p>
  )}
</div>

<div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
  <label className="flex items-start gap-3">
    <input
      type="checkbox"
      className="mt-1 h-5 w-5 rounded border-slate-300"
      {...register("acceptTerms")}
    />

    <span className="text-sm text-slate-600">
      I agree to the{" "}
      <a
        href="/terms"
        target="_blank"
        className="font-semibold text-orange-600"
      >
        Terms
      </a>

      {" "}and{" "}

      <a
        href="/privacy"
        target="_blank"
        className="font-semibold text-orange-600"
      >
        Privacy Policy
      </a>
    </span>
  </label>

  {errors.acceptTerms && (
    <p className="mt-3 text-sm text-red-600">
      {errors.acceptTerms.message}
    </p>
  )}
</div>

<LoadingButton
  type="button"
  loading={sendingOtp}
  loadingText="Sending Verification Code..."
  disabled={!isValid || isSubmitting}
  onClick={goToOtpStep}
  className="w-full"
>
  <span className="flex items-center justify-center gap-2">
    Continue

    <ArrowRight className="h-5 w-5" />
  </span>
</LoadingButton>

<div className="text-center text-sm text-slate-500">
  Already have an account?

  <a
    href="/login"
    className="ml-2 font-semibold text-orange-600 hover:text-orange-700"
  >
    Sign In
  </a>
</div>

      </>
    )}

        {step === 2 && (
      <>
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold text-slate-900">
            Verify Your Email
          </h2>

          <p className="text-slate-600">
            We've sent a verification code to
          </p>

          <p className="font-semibold text-orange-600">
            {email}
          </p>
        </div>

                <OtpInput
          value={otp}
          onChange={setOtp}
          length={6}
        />

                {apiError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-700">
              {apiError}
            </p>
          </div>
        )}

        {apiSuccess && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4">
            <p className="text-sm font-medium text-green-700">
              {apiSuccess}
            </p>
          </div>
        )}

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
          {secondsLeft > 0 ? (
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Resend code in
              </span>

              <span className="font-semibold text-orange-600">
                {secondsLeft}s
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={goToOtpStep}
              disabled={sendingOtp}
              className="font-semibold text-orange-600 transition hover:text-orange-700 disabled:opacity-50"
            >
              {sendingOtp
                ? "Sending..."
                : "Resend Verification Code"}
            </button>
          )}
        </div>

                <LoadingButton
          type="submit"
          loading={registering}
          loadingText="Creating Workspace..."
          disabled={
            otp.length !== 6 ||
            registering
          }
          className="w-full"
        >
          <span className="flex items-center justify-center gap-2">
            Verify & Create Workspace

            <ArrowRight className="h-5 w-5" />
          </span>
        </LoadingButton>
                <button
          type="button"
          onClick={() => {
            setStep(1);

            setOtp("");

            setApiError("");

            setApiSuccess("");
          }}
          className="w-full rounded-xl border border-slate-300 py-3 font-medium text-slate-700 transition hover:bg-slate-100"
        >
          Back
        </button>
              </>
    )}

        {step === 3 && (
      <>
        <div className="flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-14 w-14 text-green-600" />
          </div>
        </div>

        <div className="space-y-3 text-center">
          <h2 className="text-3xl font-bold text-slate-900">
            Workspace Created Successfully!
          </h2>

          <p className="mx-auto max-w-lg text-slate-600">
            Your KoniqTech workspace has been created successfully.
            We're preparing your account and you'll be redirected
            to complete your subscription.
          </p>
        </div>

                <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-green-600" />

            <span className="font-medium text-green-700">
              Finalizing your account...
            </span>
          </div>
        </div>

                <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 md:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-4 text-center">
            <div className="mb-2 text-lg font-bold text-orange-600">
              ✓
            </div>

            <h4 className="font-semibold">
              Organization Created
            </h4>

            <p className="mt-1 text-sm text-slate-500">
              Your company workspace is ready.
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 text-center">
            <div className="mb-2 text-lg font-bold text-orange-600">
              ✓
            </div>

            <h4 className="font-semibold">
              Owner Account Ready
            </h4>

            <p className="mt-1 text-sm text-slate-500">
              Administrator account configured.
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 text-center">
            <div className="mb-2 text-lg font-bold text-orange-600">
              ✓
            </div>

            <h4 className="font-semibold">
              Trial Activated
            </h4>

            <p className="mt-1 text-sm text-slate-500">
              Your free trial has started.
            </p>
          </div>
        </div>
              </>
    )}
      </form>
);
}