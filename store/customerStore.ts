import { Customer } from "@/models/customer.model";
import { LOCALSTORAGE_KEYS } from "@/models/browser-storage-keys";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Store = {
  customer: Customer | null;
  setCustomer: (customer: Customer | null) => void;
};

const useCustomerStore = create<Store>()(
  persist(
    (set) => ({
      customer: null,
      setCustomer: (customer) => set({ customer }),
    }),
    {
      name: LOCALSTORAGE_KEYS.CUSTOMER,
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCustomerStore;
