import { Admin } from "@/models/admin.model";
import { LOCALSTORAGE_KEYS } from "@/models/tokens";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Store = {
  admin: Admin | null;
  setAdmin(customer: Admin | null): void;
};

export const useAdminStore = create<Store>()(
  persist(
    (set) => ({
      admin: null,
      setAdmin: (admin) => set({ admin }),
    }),
    {
      name: LOCALSTORAGE_KEYS.ADMIN,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
