import { Customer } from "@/xata"
import { create } from "zustand";

type Store = {
  customer: Customer | null;
  setCustomer: (customer: Customer) => void;
}

export const useCustomerStore = create<Store>((set) => ({
  customer: null,
  setCustomer: (customer) => set({ customer }),
}));