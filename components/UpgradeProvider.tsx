"use client";

import { createContext, useContext, useState, useEffect } from "react";
import UpgradeModal from "@/components/UpgradeModal";

type UpgradeContextType = {
  setShowUpgrade: (value: boolean) => void;
};

const UpgradeContext = createContext<UpgradeContextType | null>(null);

export function UpgradeProvider({ children }: { children: React.ReactNode }) {
  const [showUpgrade, setShowUpgrade] = useState(false);

  const fetchCredits = async () => {
    try {
      const res = await fetch("/api/user/credits");
      const data = await res.json();

      if (data.credits === 0) {
        setShowUpgrade(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCredits();
  }, []);

  return (
    <UpgradeContext.Provider value={{ setShowUpgrade }}>
      {children}

      {showUpgrade && (
        <UpgradeModal onClose={() => setShowUpgrade(false)} />
      )}
    </UpgradeContext.Provider>
  );
}

// ✅ FINAL EXPORT (IMPORTANT)
export function useUpgrade() {
  const context = useContext(UpgradeContext);

  if (!context) {
    throw new Error("useUpgrade must be used inside UpgradeProvider");
  }

  return context;
}