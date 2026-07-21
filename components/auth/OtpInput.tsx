"use client";

import {
  KeyboardEvent,
  ClipboardEvent,
  ChangeEvent,
  useEffect,
  useRef,
} from "react";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  autoFocus?: boolean;
}

export default function OtpInput({
  value,
  onChange,
  length = 6,
  disabled = false,
  autoFocus = true,
}: OtpInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const values = Array.from({ length }, (_, index) => value[index] ?? "");

  useEffect(() => {
    if (autoFocus) {
      inputsRef.current[0]?.focus();
    }
  }, [autoFocus]);

  const updateValue = (
    index: number,
    character: string
  ) => {
    const next = [...values];

    next[index] = character;

    onChange(next.join(""));
  };

  const handleChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const input = event.target.value.replace(/\D/g, "");

    if (!input) {
      updateValue(index, "");
      return;
    }

    updateValue(index, input[0]);

    if (index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    switch (event.key) {
      case "Backspace":
        if (values[index]) {
          updateValue(index, "");
        } else if (index > 0) {
          inputsRef.current[index - 1]?.focus();
        }
        break;

      case "ArrowLeft":
        if (index > 0) {
          event.preventDefault();
          inputsRef.current[index - 1]?.focus();
        }
        break;

      case "ArrowRight":
        if (index < length - 1) {
          event.preventDefault();
          inputsRef.current[index + 1]?.focus();
        }
        break;

      default:
        break;
    }
  };

  const handlePaste = (
    event: ClipboardEvent<HTMLInputElement>
  ) => {
    event.preventDefault();

    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);

    if (!pasted) return;

    const next = Array.from({ length }, (_, index) => pasted[index] ?? "");

    onChange(next.join(""));

    const focusIndex =
      Math.min(pasted.length, length) - 1;

    if (focusIndex >= 0) {
      inputsRef.current[focusIndex]?.focus();
    }
  };

  return (
    <div
      className="flex justify-center gap-2 sm:gap-3"
      role="group"
      aria-label="One-time password"
    >
      {values.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            inputsRef.current[index] = element;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={
            index === 0 ? "one-time-code" : "off"
          }
          maxLength={1}
          disabled={disabled}
          value={digit}
          onChange={(event) =>
            handleChange(index, event)
          }
          onKeyDown={(event) =>
            handleKeyDown(index, event)
          }
          onPaste={handlePaste}
          aria-label={`OTP Digit ${index + 1}`}
          className="
            h-14
            w-12
            rounded-xl
            border
            border-slate-300
            bg-white
            text-center
            text-xl
            font-bold
            text-slate-900
            shadow-sm
            transition
            duration-200
            outline-none

            focus:border-orange-500
            focus:ring-4
            focus:ring-orange-100

            disabled:cursor-not-allowed
            disabled:bg-slate-100
            disabled:opacity-60

            sm:h-16
            sm:w-14
          "
        />
      ))}
    </div>
  );
}