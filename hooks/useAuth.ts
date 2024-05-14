import { authenticate } from "@/lib/api-requests";
import { useMutation } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  useActiveAccount,
  useActiveWallet,
  useActiveWalletConnectionStatus,
  useDisconnect,
} from "thirdweb/react";
import useLocalStorage from "./useLocalStorage";

const useAuth = () => {
  const { disconnect } = useDisconnect();
  const activeAccount = useActiveAccount();
  const connectionStatus = useActiveWalletConnectionStatus();
  const wallet = useActiveWallet();
  const pathname = usePathname();

  const [pageLoaded, setPageLoaded] = useState(false);
  const [accessToken, setAccessToken] = useLocalStorage(
    "accessToken",
    undefined
  );
  const router = useRouter();

  const isLoginRoute = pathname.includes("login");

  const authMutation = useMutation({
    mutationFn: authenticate,
  });

  useEffect(() => {
    if (connectionStatus === "connected") {
      setPageLoaded(true);
    }
  }, [connectionStatus]);

  useEffect(() => {
    // detect logout
    if (!activeAccount && pageLoaded) {
      //logout
      logout();
    }
  }, [activeAccount, pageLoaded]);

  useEffect(() => {
    if (!activeAccount) return;
    if (!isLoginRoute) return;
    if (!accessToken) return;

    authMutation.mutate({
      walletAddress: activeAccount.address,
      accessToken,
    });
  }, [activeAccount]);

  const logout = () => {
    if (!wallet) return;
    disconnect(wallet);
    setAccessToken(undefined);
    router.replace("/");
    localStorage.clear();
  };

  return {
    user: authMutation.data?.data.user,
    isLoading: authMutation.isPending,
    error: authMutation.error,
    accessToken: authMutation.data?.data.accessToken,
    logout,
  };
};

export default useAuth;
