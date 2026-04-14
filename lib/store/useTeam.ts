import { create } from "zustand";

interface TeamState {
  activeTeamId: string | null;
  setActiveTeam: (id: string) => void;
}

export const useTeamStore = create<TeamState>((set) => ({
  activeTeamId:
    typeof window !== "undefined"
      ? localStorage.getItem("teamId")
      : null,

  setActiveTeam: (id) => {
    localStorage.setItem("teamId", id);
    set({ activeTeamId: id });
  },
}));