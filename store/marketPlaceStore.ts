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

// Custom serialize and deserialize functions for BigInt
const serialize = (state: any) => {
  return JSON.stringify(state, (key, value) =>
    typeof value === "bigint" ? value.toString() : value,
  );
};

const deserialize = (str: string) => {
  return JSON.parse(str, (key, value) =>
    typeof value === "string" && /^\d+n$/.test(value)
      ? BigInt(value.slice(0, -1))
      : value,
  );
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
      serialize,
      deserialize,
    },
  ),
);
