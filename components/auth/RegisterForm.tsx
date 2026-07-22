"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Building2,
  CheckCircle2,
  Lock,
  Mail,
  ShieldCheck,
  User,
  ArrowRight,
} from "lucide-react";

import { Industry, CRMType } from "@prisma/client";

import LoadingButton from "@/components/auth/LoadingButton";
import FormInput from "@/components/auth/FormInput";
import PasswordStrength from "@/components/auth/PasswordStrength";
import IndustrySelector from "@/components/auth/IndustrySelector";
import OtpInput from "@/components/auth/OtpInput";
import StepIndicator from "@/components/auth/StepIndicator";

import {
  registerSchema,
  type RegisterSchema,
} from "@/shared/lib/validators/register";

export default function RegisterForm() {
  const router = useRouter();

  const [step, setStep] = useState(1);

  const [sendingOtp, setSendingOtp] = useState(false);

  const [verifying, setVerifying] = useState(false);

  const [secondsLeft, setSecondsLeft] = useState(0);

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [apiError, setApiError] =
    useState<string>("");

  const [apiSuccess, setApiSuccess] =
    useState<string>("");

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setValue,
    getValues,
    formState: {
      errors,
      isSubmitting,
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

      industry: Industry.roofing,

      crmType: CRMType.roofing,

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

  const otp = watch("otp") ?? "";

 

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setTimeout(() => {
      setSecondsLeft((v) => v - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const goToOtpStep = async () => {
    setApiError("");
    setApiSuccess("");

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

console.log("VALID =", valid);
console.log("VALUES =", getValues());

if (!valid) {
  console.log("ERRORS =", errors);
  return;
}

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
            email: getValues("email"),
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        setApiError(
          result.message ??
            "Unable to send OTP."
        );

        return;
      }

      setApiSuccess(result.message);

      setSecondsLeft(60);

      setStep(2);
    } catch {
      setApiError(
        "Something went wrong."
      );
    } finally {
      setSendingOtp(false);
    }
  };

  const verifyAndRegister = async () => {
    setApiError("");
    setApiSuccess("");

    const otp = getValues("otp");

    if (!otp || otp.length !== 6) {
    setApiError("Please enter the 6-digit OTP.");
     return;
    }
    try {
      setVerifying(true);

      const response = await fetch(
        "/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            getValues()
          ),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        setApiError(
          result.message ??
            "Registration failed."
        );

        return;
      }

      setApiSuccess(
        "Registration successful."
      );

      setStep(3);
    } catch {
      setApiError(
        "Something went wrong."
      );
    } finally {
      setVerifying(false);
    }
  };

  const resendOtp = async () => {
    if (secondsLeft > 0) return;

    await goToOtpStep();
  };

  const onSubmit = async () => {
  console.log("onSubmit called. Step =", step);

  if (step === 1) {
    await goToOtpStep();
    return;
  }

  if (step === 2) {
    await verifyAndRegister();
    return;
  }
};

    
  

  return (
    <>
 <form
  onSubmit={handleSubmit(
    onSubmit,
    (errors) => {
      console.log("FORM ERRORS:", errors);
      alert("Validation failed. Open Console.");
    }
  )}
  className="space-y-8"
  noValidate
>
    <StepIndicator
      currentStep={step}
      steps={[
        {
          id: 1,
          title: "Account",
        },
        {
          id: 2,
          title: "Verification",
        },
        {
          id: 3,
          title: "Complete",
        },
      ]}
    />

    {apiError && (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
        <p className="text-sm font-medium text-red-700">
          {apiError}
        </p>
      </div>
    )}

    {apiSuccess && (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
        <p className="text-sm font-medium text-green-700">
          {apiSuccess}
        </p>
      </div>
    )}

    {step === 1 && (
      <div className="space-y-6">

        <FormInput
          label="Full Name"
          required
          leftIcon={
            <User className="h-5 w-5 text-slate-400" />
          }
          error={errors.fullName?.message}
          {...register("fullName")}
        />

        <FormInput
          label="Company Name"
          required
          leftIcon={
            <Building2 className="h-5 w-5 text-slate-400" />
          }
          error={errors.companyName?.message}
          {...register("companyName")}
        />

        <FormInput
          label="Business Email"
          type="email"
          required
          leftIcon={
            <Mail className="h-5 w-5 text-slate-400" />
          }
          error={errors.email?.message}
          {...register("email")}
        />

        <div className="space-y-2">

          <FormInput
            label="Password"
            required
            type={
              showPassword
                ? "text"
                : "password"
            }
            leftIcon={
              <Lock className="h-5 w-5 text-slate-400" />
            }
            error={errors.password?.message}
            rightIcon={
              <button
                type="button"
                onClick={() =>
                  setShowPassword((v) => !v)
                }
                className="text-xs font-semibold text-orange-600"
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>
            }
            {...register("password")}
          />

          <PasswordStrength
            password={password}
           
          />

        </div>

        <FormInput
          label="Confirm Password"
          required
          type={
            showConfirmPassword
              ? "text"
              : "password"
          }
          leftIcon={
            <ShieldCheck className="h-5 w-5 text-slate-400" />
          }
          error={
            errors.confirmPassword?.message
          }
          rightIcon={
            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  (v) => !v
                )
              }
              className="text-xs font-semibold text-orange-600"
            >
              {showConfirmPassword
                ? "Hide"
                : "Show"}
            </button>
          }
          {...register("confirmPassword")}
        />

        <div className="space-y-3">

          <label className="text-sm font-semibold text-slate-700">
            Select Industry
          </label>

          <IndustrySelector
            value={industry}
            onChange={(value) => {
              setValue(
                "industry",
                value as Industry,
                {
                  shouldValidate: true,
                }
              );

              setValue(
                "crmType",
                value as CRMType,
                {
                  shouldValidate: true,
                }
              );
            }}
          />

          {errors.industry && (
            <p className="text-sm text-red-600">
              {errors.industry.message}
            </p>
          )}

        </div>

        <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">

          <input
            type="checkbox"
            className="mt-1 h-5 w-5 rounded"
            {...register("acceptTerms")}
          />

          <span className="text-sm leading-6 text-slate-600">
            I agree to the{" "}
            <a
              href="/terms"
              className="font-semibold text-orange-600"
            >
              Terms
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="font-semibold text-orange-600"
            >
              Privacy Policy
            </a>
          </span>

        </label>

        {errors.acceptTerms && (
          <p className="text-sm text-red-600">
            {errors.acceptTerms.message}
          </p>
        )}

       <button
  type="submit"
  className="w-full rounded-xl bg-red-600 p-4 text-white"
>
  TEST SUBMIT
</button>

      </div>
    )}

        {step === 2 && (
      <div className="space-y-8">

        <div className="text-center">

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
            <Mail className="h-8 w-8 text-orange-600" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            Verify Your Email
          </h2>

          <p className="mt-3 text-slate-600">
            We've sent a 6-digit verification code to
          </p>

          <p className="mt-1 font-semibold text-slate-900">
            {watch("email")}
          </p>

        </div>

        <OtpInput
          value={otp}
          onChange={(value) =>
            setValue("otp", value, {
              shouldValidate: true,
            })
          }
          length={6}
          disabled={verifying}
        />

        {errors.otp && (
          <p className="text-center text-sm font-medium text-red-600">
            {errors.otp.message}
          </p>
        )}

        <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="font-semibold text-slate-900">
                Didn't receive the code?
              </p>

              <p className="mt-1 text-sm text-slate-600">
                Check your spam folder or resend another OTP.
              </p>
            </div>

            <LoadingButton
              type="button"
              variant="outline"
              size="md"
              loading={sendingOtp}
              disabled={secondsLeft > 0}
              onClick={resendOtp}
            >
              {secondsLeft > 0
                ? `Resend (${secondsLeft}s)`
                : "Resend OTP"}
            </LoadingButton>

          </div>

        </div>

        <div className="flex gap-4">

          <LoadingButton
            type="button"
            variant="outline"
            size="lg"
            fullWidth
            onClick={() => {
              setStep(1);
              setApiError("");
              setApiSuccess("");
            }}
          >
            Back
          </LoadingButton>

          <LoadingButton
            type="submit"
            loading={verifying}
            loadingText="Creating Account..."
            fullWidth
            rightIcon={
              <ArrowRight className="h-5 w-5" />
            }
          >
            Verify & Create Account
          </LoadingButton>

        </div>

      </div>
    )}

        {step === 3 && (
      <div className="space-y-8">

        <div className="flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-14 w-14 text-green-600" />
          </div>
        </div>

        <div className="text-center space-y-3">

          <h2 className="text-3xl font-bold text-slate-900">
            Welcome to KoniqTech!
          </h2>

          <p className="mx-auto max-w-lg text-slate-600">
            Your workspace has been created successfully.
            We're preparing your CRM and redirecting you to
            complete your subscription.
          </p>

        </div>

        <div className="rounded-2xl border border-green-200 bg-green-50 p-6">

          <div className="space-y-4">

            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-600" />

              <span className="font-medium text-slate-800">
                Organization Created
              </span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-600" />

              <span className="font-medium text-slate-800">
                Owner Account Ready
              </span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-600" />

              <span className="font-medium text-slate-800">
                Email Verified
              </span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-600" />

              <span className="font-medium text-slate-800">
                Trial Activated
              </span>
            </div>

          </div>

        </div>

        <div className="flex justify-center">

          <div className="flex items-center gap-3 rounded-xl bg-orange-50 px-5 py-3">

            <div className="h-5 w-5 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />

            <span className="font-medium text-orange-700">
              Redirecting to Checkout...
            </span>

          </div>

        </div>

      </div>
    )}

  </form>
</>
);
}