import { LOCALSTORAGE_KEYS } from "@/models/browser-storage-keys";
import { User } from "@/models/user.model";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Store = {
  user: User | null;
  setUser(user: User | null): void;
  verificationWords: string | null;
  setVerificationWords(words: string | null): void;
  isRegistered: boolean;
  setIsRegistered(isRegistered: boolean): void;
};

export const useUserStore = create<Store>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      verificationWords: null,
      setVerificationWords: (words) => set({ verificationWords: words }),
      isRegistered: false,
      setIsRegistered: (isRegistered) => set({ isRegistered }),
    }),
    {
      name: LOCALSTORAGE_KEYS.USER,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
