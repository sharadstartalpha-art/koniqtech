import { Suspense } from "react";
import SettingsClient from "./SettingsClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading settings...</div>}>
      <SettingsClient />
    </Suspense>
  );
}