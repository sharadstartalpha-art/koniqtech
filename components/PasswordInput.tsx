"use client";

import { useState } from "react";

export default function PasswordInput({
  value,
  onChange,
  placeholder = "Password",
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative mb-6">
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-b py-2 outline-none pr-10 focus:border-orange-500"
      />

      <span
        onClick={() => setShow(!show)}
        className="absolute right-0 top-2 cursor-pointer text-gray-500"
      >
        {show ? "🙈" : "👁️"}
      </span>
    </div>
  );
}