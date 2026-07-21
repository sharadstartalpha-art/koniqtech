import bcrypt from "bcryptjs";

export interface PasswordStrength {
  score: number;
  label: "Very Weak" | "Weak" | "Fair" | "Good" | "Strong";
  color: string;
  checks: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
}

const SALT_ROUNDS = 12;

export async function hashPassword(
  password: string
): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function validatePassword(
  password: string
): string[] {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push(
      "Password must contain at least 8 characters."
    );
  }

  if (!/[A-Z]/.test(password)) {
    errors.push(
      "Password must contain at least one uppercase letter."
    );
  }

  if (!/[a-z]/.test(password)) {
    errors.push(
      "Password must contain at least one lowercase letter."
    );
  }

  if (!/[0-9]/.test(password)) {
    errors.push(
      "Password must contain at least one number."
    );
  }

  if (!/[!@#$%^&*()_\-+=<>?/[\]{}|:;"'`~.,]/.test(password)) {
    errors.push(
      "Password must contain at least one special character."
    );
  }

  return errors;
}

export function isPasswordValid(
  password: string
): boolean {
  return validatePassword(password).length === 0;
}

export function calculatePasswordStrength(
  password: string
): PasswordStrength {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special:
      /[!@#$%^&*()_\-+=<>?/[\]{}|:;"'`~.,]/.test(password),
  };

  let score = 0;

  Object.values(checks).forEach((value) => {
    if (value) score++;
  });

  if (password.length >= 12) score++;

  if (score > 5) score = 5;

  const levels = [
    {
      label: "Very Weak",
      color: "bg-red-500",
    },
    {
      label: "Weak",
      color: "bg-orange-500",
    },
    {
      label: "Fair",
      color: "bg-yellow-500",
    },
    {
      label: "Good",
      color: "bg-blue-500",
    },
    {
      label: "Strong",
      color: "bg-green-500",
    },
  ] as const;

  const level =
    levels[Math.max(0, score - 1)] ?? levels[0];

  return {
    score,
    label: level.label,
    color: level.color,
    checks,
  };
}

export function generatePassword(
  length = 16
): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghijkmnopqrstuvwxyz";
  const numbers = "23456789";
  const special = "!@#$%^&*";

  const all =
    upper + lower + numbers + special;

  let password = "";

  password +=
    upper[Math.floor(Math.random() * upper.length)];

  password +=
    lower[Math.floor(Math.random() * lower.length)];

  password +=
    numbers[Math.floor(Math.random() * numbers.length)];

  password +=
    special[Math.floor(Math.random() * special.length)];

  while (password.length < length) {
    password +=
      all[Math.floor(Math.random() * all.length)];
  }

  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}