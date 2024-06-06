import { Company } from "@/models/company.model";
import { LOCALSTORAGE_KEYS } from "@/models/tokens";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Store = {
  company: Company | null;
  setCompany(customer: Company | null): void;
};

export const useCompanyStore = create<Store>()(
  persist(
    (set) => ({
      company: null,
      setCompany: (company) => set({ company }),
    }),
    {
      name: LOCALSTORAGE_KEYS.COMPANY,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
