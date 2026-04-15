"use client";

import { create } from "zustand";

interface TeamState {
  activeTeamId: string | null;
  setTeam: (id: string) => void;
  loadFromStorage: () => void;
}

export const useTeamStore = create<TeamState>((set) => ({
  activeTeamId: null,

  setTeam: (id) => {
    localStorage.setItem("activeTeamId", id);
    set({ activeTeamId: id });
  },

  loadFromStorage: () => {
    const id = localStorage.getItem("activeTeamId");
    if (id) set({ activeTeamId: id });
  },
}));