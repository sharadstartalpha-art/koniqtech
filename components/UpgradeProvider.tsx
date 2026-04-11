"use client";

import { createContext, useContext, useState } from "react";
import UpgradeModal from "./UpgradeModal";

const UpgradeContext = createContext<any>(null);

export function UpgradeProvider({ children }: any) {
  const [showUpgrade, setShowUpgrade] = useState(false);

  return (
    <UpgradeContext.Provider value={{ setShowUpgrade }}>
      {children}

      {showUpgrade && (
        <UpgradeModal onClose={() => setShowUpgrade(false)} />
      )}
    </UpgradeContext.Provider>
  );
}

export const useUpgrade = () => {
  const ctx = useContext(UpgradeContext);

  if (!ctx) {
    throw new Error("useUpgrade must be used inside UpgradeProvider");
  }

  return ctx;
};