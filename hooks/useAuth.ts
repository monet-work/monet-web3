import { useMutation } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  useActiveAccount,
  useActiveWalletConnectionStatus,
  useDisconnect,
} from "thirdweb/react";
import useLocalStorage from "./useLocalStorage";
import { createWallet } from "thirdweb/wallets";
import { apiService } from "@/services/api.service";

const useAuth = () => {
  const { disconnect } = useDisconnect();
  const activeAccount = useActiveAccount();
  const connectionStatus = useActiveWalletConnectionStatus();
  const pathname = usePathname();

  const [thirdwebConnected, setThirdwebConnected] = useState(false);
  const [accessToken, setAccessToken] = useLocalStorage(
    "accessToken",
    undefined
  );
  const [refreshToken, setRefreshToken] = useLocalStorage(
    "refreshToken",
    undefined
  );
  const router = useRouter();

  const publicRoutes = ["/", "/login", "/verify"];

  const authMutation = useMutation({
    mutationFn: apiService.authenticate,
  });

  useEffect(() => {
    if (connectionStatus === "connected") {
      setThirdwebConnected(true);
    }
  }, [connectionStatus]);

  useEffect(() => {
    if(publicRoutes.some(route => pathname.includes(route))) return;

    if (!accessToken || !refreshToken) {
      console.log('logging out', pathname)
      logout();
      return;
    }
  }, [accessToken, refreshToken, pathname]);

  useEffect(() => {
    // detect logout
    if (!activeAccount && thirdwebConnected) {
      //logout
      logout();
    }
  }, [activeAccount, thirdwebConnected]);

  useEffect(() => {
    if (!refreshToken || typeof refreshToken !== "object") return;

    authMutation.mutate(refreshToken.token, {
      onError: (error) => {
        console.error(error);
        logout();
      },
      onSuccess: (response) => {
        const {
          company,
          customer,
          email,
          isEmailVerified,
          wallet_address,
          roles,
          name,
          id,
        } = response.data;
      },
    });
  }, [accessToken, refreshToken, pathname]);

  const logout = () => {
    const wallet = createWallet("io.metamask");
    disconnect(wallet);
    setAccessToken(undefined);
    router.replace("/");
    localStorage.clear();
  };

  return {
    isLoading: authMutation.isPending,
    error: authMutation.error,
    logout,
  };
};

export default useAuth;
