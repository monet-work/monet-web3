import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
} from "@tanstack/react-query";
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
import { matchesDynamicRoute } from "@/lib/utils";

const useAuth = () => {
  const { disconnect } = useDisconnect();
  const activeAccount = useActiveAccount();
  const connectionStatus = useActiveWalletConnectionStatus();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [thirdwebConnected, setThirdwebConnected] = useState(false);

  const [accessTokenData, setAccessTokenData] = useLocalStorage(
    LOCALSTORAGE_KEYS.ACCESS_TOKEN_DATA,
    { token: "", expiry: 0 }
  );

  const [refreshTokenData, setRefreshTokenData] = useLocalStorage(
    LOCALSTORAGE_KEYS.REFRESH_TOKEN_DATA,
    { token: "", expiry: 0 }
  );

  const [userRoles, setUserRoles] = useState<any>([]);
  console.log(userRoles);
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
    "/marketplace",
    "/marketplace/:pointName",
  ];

  const isPublicRoute = publicRoutes.some((route) =>
    matchesDynamicRoute(pathname, route)
  );

  const {
    data: authResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["auth"],
    queryFn: apiService.authenticate,
    enabled: !isPublicRoute,
  });

  const { mutate: refreshTokens } = useMutation({
    mutationFn: apiService.refreshToken,
    onSuccess: (response) => {
      console.log(response, "refresh token response");
      setAccessTokenData({
        token: response.data.access.token,
        expiry: response.data.access.expires,
      });
      setRefreshTokenData({
        token: response.data.refresh.token,
        expiry: response.data.refresh.expires,
      });

      queryClient.invalidateQueries(["auth"] as any);
    },
  });

  useEffect(() => {
    if (connectionStatus === "connected") {
      setThirdwebConnected(true);
    }
  }, [connectionStatus]);

  useEffect(() => {
    if (!activeAccount && thirdwebConnected) {
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

      setUserRoles(roles.map((role) => role.role));
    }
  }, [authResponse]);

  useEffect(() => {
    if (error) {
      console.log("authError", error);
      logout();
    }
  }, [error]);

  useEffect(() => {
    if (!isPublicRoute && userRoles.length > 0) {
      console.log("check access");
      checkAccess();
    }
  }, [pathname, accessTokenData, refreshTokenData, userRoles]);

  const checkAccess = async () => {
    const now = Date.now();
    const accessTokenExpiryDate = new Date(accessTokenData.expiry).getTime();
    const refreshTokenExpiryDate = new Date(refreshTokenData.expiry).getTime();
    console.log(now, accessTokenExpiryDate, refreshTokenExpiryDate);

    if (accessTokenExpiryDate > now) {
      console.log("Access token valid");
      if (userHasAccess()) {
        console.log("User has access");
        return;
      } else {
        showPageNotFound();
        console.log("show page not found");
      }
    } else {
      console.log("Access token expired");
      if (refreshTokenExpiryDate > now) {
        refreshTokens(refreshTokenData.token);
      } else {
        if (accessTokenExpiryDate === 0) {
          // to prevent unidentified bug where access token is set to 0
          router.refresh();
        } else {
          logout();
          console.log("Refresh token expired, log out");
        }
      }
    }
  };

  const userHasAccess = () => {
    if ("/admin/dashboard" === pathname) {
      console.log("admin dashboard", userRoles.includes("ADMIN"), userRoles);
      return userRoles.includes("ADMIN");
    }
    if ("/company/dashboard" === pathname) {
      return userRoles.includes("COMPANY");
    }
    if ("/customer/dashboard" === pathname) {
      return userRoles.includes("CUSTOMER");
    }
  };

  const showPageNotFound = () => {
    router.replace("/404");
  };

  const logout = () => {
    const wallet = createWallet("io.metamask");
    disconnect(wallet);
    // router.replace("/");
    // localStorage.clear();
    // window.location.reload();
  };

  return {
    isLoading: isLoading,
    error: error,
    logout,
  };
};

export default useAuth;
