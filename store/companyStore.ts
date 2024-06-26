import { Company } from "@/xata";
import { create } from "zustand";

type Store = {
  company: Company | null;
  setCompany(customer: Company | null): void;
};

export const useCompanyStore = create<Store>((set) => ({
  company: null,
  setCompany: (company) => set({ company }),
}));
