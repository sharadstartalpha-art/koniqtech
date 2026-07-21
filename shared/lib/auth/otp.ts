import crypto from "crypto";

export const OTP_LENGTH = 6;
export const OTP_EXPIRY_MINUTES = 10;

export interface OtpRecord {
  otpHash: string;
  expiresAt: Date;
}

export interface OtpVerificationResult {
  success: boolean;
  reason?:
    | "INVALID"
    | "EXPIRED"
    | "MISSING";
}

/**
 * Generates a numeric OTP.
 */
export function generateOtp(
  length: number = OTP_LENGTH
): string {
  let otp = "";

  while (otp.length < length) {
    otp += crypto.randomInt(0, 10).toString();
  }

  return otp;
}

/**
 * SHA-256 hash of OTP.
 */
export function hashOtp(otp: string): string {
  return crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");
}

/**
 * Generates OTP + hash + expiry.
 */
export function createOtp(): {
  otp: string;
  otpHash: string;
  expiresAt: Date;
} {
  const otp = generateOtp();

  return {
    otp,
    otpHash: hashOtp(otp),
    expiresAt: getOtpExpiry(),
  };
}

/**
 * Expiration time.
 */
export function getOtpExpiry(
  minutes: number = OTP_EXPIRY_MINUTES
): Date {
  return new Date(
    Date.now() + minutes * 60 * 1000
  );
}

/**
 * Checks whether OTP has expired.
 */
export function isOtpExpired(
  expiresAt: Date
): boolean {
  return expiresAt.getTime() < Date.now();
}

/**
 * Timing-safe comparison.
 */
export function verifyOtp(
  otp: string,
  otpHash: string
): boolean {
  const incomingHash = hashOtp(otp);

  return crypto.timingSafeEqual(
    Buffer.from(incomingHash),
    Buffer.from(otpHash)
  );
}

/**
 * Full verification helper.
 */
export function verifyOtpRecord(
  otp: string,
  record?: OtpRecord | null
): OtpVerificationResult {
  if (!record) {
    return {
      success: false,
      reason: "MISSING",
    };
  }

  if (isOtpExpired(record.expiresAt)) {
    return {
      success: false,
      reason: "EXPIRED",
    };
  }

  if (!verifyOtp(otp, record.otpHash)) {
    return {
      success: false,
      reason: "INVALID",
    };
  }

  return {
    success: true,
  };
}