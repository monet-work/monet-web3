import { User } from "@/xata";
import { create } from "zustand";

type Store = {
  user: User | null;
  setUser(customer: User | null): void;
};

export const useUserStore = create<Store>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
