import { useQuery } from "@tanstack/react-query";
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
    "/admin/login",
    "/company/verify",
    "/customer/verify",
    "/admin/verify",
    "/company/submit-request",
    "/customer/submit-request",
    "/admin/submit-request",
  ];

  const isPrivateRoute = !publicRoutes.includes(pathname);

  const {
    data: authResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["auth"],
    queryFn: apiService.authenticate,
    enabled: isPrivateRoute
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
      console.log("no active account");
      logout();
    }
  }, [activeAccount, thirdwebConnected]);

  useEffect(() => {
    if (authResponse) {
      const {
        company,
        customer,
        email,
        isEmailVerified,
        name,
        roles,
        wallet_address,
      } = authResponse.data;
    }
  }, [authResponse]);

  useEffect(() => {
    if (error) {
      console.log("authError", error);
      logout();
    }
  }, [error]);

  const logout = () => {
    const wallet = createWallet("io.metamask");
    disconnect(wallet);
    router.replace("/");
    localStorage.clear();
    window.location.reload();
  };

  return {
    isLoading: isLoading,
    error: error,
    logout,
  };
};

export default useAuth;
