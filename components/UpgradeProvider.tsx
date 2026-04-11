"use client";

import { createContext, useContext, useState } from "react";
import UpgradeModal from "./UpgradeModal";

type UpgradeContextType = {
  openUpgrade: () => void;
};

const UpgradeContext = createContext<UpgradeContextType | null>(null);

export default function UpgradeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showUpgrade, setShowUpgrade] = useState(false);

  const openUpgrade = () => setShowUpgrade(true);

  return (
    <UpgradeContext.Provider value={{ openUpgrade }}>
      {children}

      {showUpgrade && (
        <UpgradeModal onClose={() => setShowUpgrade(false)} />
      )}
    </UpgradeContext.Provider>
  );
}

/* ✅ THIS WAS MISSING */
export function useUpgrade() {
  const ctx = useContext(UpgradeContext);

  if (!ctx) {
    throw new Error("useUpgrade must be used inside UpgradeProvider");
  }

  return ctx;
}