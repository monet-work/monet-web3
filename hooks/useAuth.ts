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
import { delay } from "@/lib/utils";
import { LOCALSTORAGE_KEYS } from "@/models/tokens";

const useAuth = () => {
  const { disconnect } = useDisconnect();
  const activeAccount = useActiveAccount();
  const connectionStatus = useActiveWalletConnectionStatus();
  const pathname = usePathname();

  const [thirdwebConnected, setThirdwebConnected] = useState(false);
  const [accessToken, setAccessToken] = useLocalStorage(
    LOCALSTORAGE_KEYS.ACCESS_TOKEN,
    ""
  );
  const [refreshToken, setRefreshToken] = useLocalStorage(
    LOCALSTORAGE_KEYS.REFRESH_TOKEN,
    ""
  );
  const router = useRouter();
  
  const publicRoutes = [
    "/",
    "/company/login",
    "/customer/login",
    "/company/verify",
    "/customer/verify",
    "/admin/verify",
    "/admin/login",
    "/company/submit-request",
    "/customer/submit-request",
  ];
  
  const isPrivateRoute = !publicRoutes.includes(pathname);

  const authMutation = useMutation({
    mutationFn: apiService.authenticate,
  });

  useEffect(() => {
    if (connectionStatus === "connected") {
      setThirdwebConnected(true);
    }
  }, [connectionStatus]);

  useEffect(() => {
    // detect logout
    if (!activeAccount && thirdwebConnected) {
      //logout
      logout();
    }
  }, [activeAccount, thirdwebConnected]);

  useEffect(() => {
    if (!isPrivateRoute) return;

    const performAuthCheck = async () => {
      await delay(1000);

      if (isPrivateRoute && (!accessToken || !refreshToken)) {
        logout();
        return;
      }

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
    };

    performAuthCheck();
  }, [accessToken, refreshToken, isPrivateRoute]);

  const logout = () => {
    const wallet = createWallet("io.metamask");
    disconnect(wallet);
    router.replace("/");
    localStorage.clear();
  };

  return {
    isLoading: authMutation.isPending ?? true,
    error: authMutation.error,
    logout,
  };
};

export default useAuth;
