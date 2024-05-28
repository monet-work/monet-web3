import { Customer } from "@/models/customer.model";
import { LOCALSTORAGE_KEYS } from "@/models/tokens";
import { create } from "zustand";
import { persist } from "zustand/middleware";

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
    { name: LOCALSTORAGE_KEYS.CUSTOMER, 
      
    }
  )
);

export default useCustomerStore;
