
import { User } from "@/models/user.model";
import { create } from "zustand";

type Store = {
  user: User | null;
  setUser(user: User | null): void;
  verificationWords: string | null;
  setVerificationWords(words: string | null): void;
  isRegistered: boolean;
  setIsRegistered(isRegistered: boolean): void;
};

export const useUserStore = create<Store>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  verificationWords: null,
  setVerificationWords: (words) => set({ verificationWords: words }),
  isRegistered: false,
  setIsRegistered: (isRegistered) => set({ isRegistered }),
}));
