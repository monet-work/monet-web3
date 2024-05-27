import { Customer } from "@/models/customer.model";
import { LOCALSTORAGE_KEYS } from "@/models/tokens";
import { StoreApi, UseBoundStore, create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Store = {
  customer: Customer | null;
  setCustomer(customer: Customer | null): void;
};

export const useCustomerStore = create(
  persist(
    create<Store>((set) => ({
      customer: null,
      setCustomer: () => set({ customer: null }),
    })),
    {
      name: LOCALSTORAGE_KEYS.CUSTOMER,
      storage: createJSONStorage(() => localStorage),
    }
  )
) ;
