import { create } from "zustand";

interface TeamState {
  activeTeamId: string | null;
  setActiveTeam: (id: string) => void;
}

export const useTeamStore = create<TeamState>((set: any) => ({
  activeTeamId: null,
  setActiveTeam: (id: string) => set({ activeTeamId: id }),
}));