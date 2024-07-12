import { Company } from "@/models/company.model";
import { LOCALSTORAGE_KEYS } from "@/models/browser-storage-keys";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Store = {
  company: Company | null;
  setCompany(customer: Company | null): void;
  pointsDeleted: boolean;
  setPointsDeleted(pointsDeleted: boolean): void;
};

export const useCompanyStore = create<Store>()(
  persist(
    (set) => ({
      company: null,
      setCompany: (company) => set({ company }),
      pointsDeleted: false,
      setPointsDeleted: (pointsDeleted) => set({ pointsDeleted }),
    }),
    {
      name: LOCALSTORAGE_KEYS.COMPANY,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
