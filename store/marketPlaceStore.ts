// create marketplace store

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { LOCALSTORAGE_KEYS } from "@/models/tokens";

type Store = {
  marketPlace: any;
  setMarketPlace(marketPlace: any): void;
};

export const useMarketPlaceStore = create<Store>()(
  persist(
    (set, get) => ({
      marketPlace: null,
      setMarketPlace: (data) => set({ marketPlace: data }),
    }),
    {
      name: LOCALSTORAGE_KEYS.MARKETPLACE_POINTS,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
