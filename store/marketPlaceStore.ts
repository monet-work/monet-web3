// create marketplace store

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { LOCALSTORAGE_KEYS } from "@/models/browser-storage-keys";

type Store = {
  marketPlace: any;
  setMarketPlace(marketPlace: any): void;
  offerCreated: boolean;
  setOfferCreated(offerCreated: boolean): void;
  listingCancelled: boolean;
  setListingCancelled(listingCancelled: boolean): void;
};

export const useMarketPlaceStore = create<Store>()(
  persist(
    (set, get) => ({
      marketPlace: null,
      setMarketPlace: (data) => set({ marketPlace: data }),
      offerCreated: false,
      setOfferCreated: (offerCreated) => set({ offerCreated }),
      listingCancelled: false,
      setListingCancelled: (listingCancelled) => set({ listingCancelled }),
    }),
    {
      name: LOCALSTORAGE_KEYS.MARKETPLACE_POINTS,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
