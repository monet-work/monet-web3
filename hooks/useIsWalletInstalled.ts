import { useEffect, useState } from "react";

// Customize the list with the wallets you want to support
const WALLETS: Record<string, { flag: string }> = {
  metamask: {
    flag: "isMetaMask",
  },
  trustWallet: {
    flag: "isTrust",
  },
};

const useIsWalletInstalled = ({
  wallet,
  flag,
}: {
  wallet?: string;
  flag?: string;
}) => {
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof (window as any).ethereum === "undefined"
    ) {
      return;
    }

    if (flag) {
      setIsInstalled((window as any).ethereum[flag]);
      return;
    }

    if (wallet && WALLETS[wallet]) {
      const { flag: walletFlag } = WALLETS[wallet];
      setIsInstalled((window as any).ethereum[walletFlag]);
    }
  }, [wallet, flag]);

  return isInstalled;
};

export default useIsWalletInstalled;
