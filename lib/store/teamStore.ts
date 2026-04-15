"use client";

import { create } from "zustand";

interface TeamState {
  activeTeamId: string | null;
  setTeam: (id: string) => void;
}

export const useTeamStore = create<TeamState>((set) => ({
  activeTeamId:
    typeof window !== "undefined"
      ? localStorage.getItem("activeTeamId")
      : null,

  setTeam: (id) => {
    localStorage.setItem("activeTeamId", id);
    set({ activeTeamId: id });
  },
}));