"use client";

import { createContext, useContext, useState, useEffect } from "react";
import UpgradeModal from "@/components/UpgradeModal";

const UpgradeContext = createContext<any>(null);

export function UpgradeProvider({ children }: any) {
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);

  const fetchCredits = async () => {
    const res = await fetch("/api/user/credits");
    const data = await res.json();
    setCredits(data.credits);

    // 🔥 AUTO TRIGGER
    if (data.credits === 0) {
      setShowUpgrade(true);
    }
  };

  useEffect(() => {
    fetchCredits();
  }, []);

  return (
    <UpgradeContext.Provider value={{ setShowUpgrade, fetchCredits }}>
      {children}

      {showUpgrade && (
        <UpgradeModal onClose={() => setShowUpgrade(false)} />
      )}
    </UpgradeContext.Provider>
  );
}

export const useUpgrade = () => useContext(UpgradeContext);