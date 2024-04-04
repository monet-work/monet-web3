import { Account } from "thirdweb/wallets";
import { create } from "zustand";

type Store = {
  account: Account | null;
  setWalletAccount: (account: Account) => void;
  removeWalletAccount: () => void;
};

const useThirdWebStore = create<Store>((set) => ({
  account: null,
  setWalletAccount: (account) => set({ account }),
  removeWalletAccount: () => set({ account: null }),
}));

export default useThirdWebStore;
