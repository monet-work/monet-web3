import { Customer } from "@/xata";
import { create } from "zustand";

type Store = {
  customer: Customer | null;
  onChainPoints: string | null;
  setCustomer: (customer: Customer | null) => void;
  setOnChainPoints: (points: string) => void;
  addOnChainPoints: (points: string) => void;
};

export const useCustomerStore = create<Store>((set) => ({
  customer: null,
  setCustomer: (customer) => set({ customer }),
  onChainPoints: null,
  setOnChainPoints: (points) => set({ onChainPoints: points }),
  addOnChainPoints: (points) =>
    set((state) => ({
      onChainPoints: state.onChainPoints
        ? (BigInt(state.onChainPoints) + BigInt(points)).toString()
        : points,
    })),
}));
