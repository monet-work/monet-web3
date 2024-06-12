// create marketplace store

import { LOCALSTORAGE_KEYS } from "@/models/browser-storage-keys";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Store = {
  rewardPoints: any;
  setRewardPoints(rewardPoints: any): void;
};

export const useRewardPointsStore = create<Store>()(
  persist(
    (set, get) => ({
      rewardPoints: null,
      setRewardPoints: (data) => set({ rewardPoints: data }),
    }),
    {
      name: LOCALSTORAGE_KEYS.REWARD_POINTS,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
