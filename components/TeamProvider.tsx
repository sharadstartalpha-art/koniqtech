"use client";

import { useEffect } from "react";
import { useTeamStore } from "@/lib/teamStore";

export default function TeamProvider({ teams }: any) {
  const { setTeam } = useTeamStore();

  useEffect(() => {
    const saved = localStorage.getItem("activeTeamId");

    if (saved) {
      setTeam(saved);
    } else if (teams?.length) {
      setTeam(teams[0].id);
    }
  }, [teams]);

  return null;
}