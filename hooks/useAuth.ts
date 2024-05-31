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
import { ApiError } from "next/dist/server/api-utils";
import { Role, User } from "@/xata";

const useAuth = () => {
  const { disconnect } = useDisconnect();
  const activeAccount = useActiveAccount();
  const connectionStatus = useActiveWalletConnectionStatus();
  const pathname = usePathname();
  // console.log(pathname);
  const queryClient = useQueryClient();
  const [thirdwebConnected, setThirdwebConnected] = useState(false);
  const [accessToken, setAccessToken] = useLocalStorage(
    LOCALSTORAGE_KEYS.ACCESS_TOKEN,
    ""
  );
  const [accessTokenExpiry, setAccessTokenExpiry] = useLocalStorage(
    LOCALSTORAGE_KEYS.ACCESS_TOKEN_EXPIRY,
    0
  );
  const [refreshToken, setRefreshToken] = useLocalStorage(
    LOCALSTORAGE_KEYS.REFRESH_TOKEN,
    ""
  );
  const [refreshTokenExpiry, setRefreshTokenExpiry] = useLocalStorage(
    LOCALSTORAGE_KEYS.REFRESH_TOKEN_EXPIRY,
    0
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
  ];

  const isPrivateRoute = !publicRoutes.includes(pathname);

  const {
    data: authResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["auth"],
    queryFn: apiService.authenticate,
    enabled: isPrivateRoute,
  });

  const { mutate: refreshTokens } = useMutation({
    mutationFn: apiService.refreshToken,
    onSuccess: (response) => {
      console.log(response);
      setAccessToken(response.data.access);
      setAccessTokenExpiry(response.data.access);
      setRefreshToken(response.data.refresh_token);
      setRefreshTokenExpiry(response.data.refresh_token_expiry);

      queryClient.invalidateQueries(["auth"] as any);
    },
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
      // logout();
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
      // logout();
    }
  }, [error]);

  useEffect(() => {
    if (isPrivateRoute && userRoles.length > 0) {
      console.log("check access");
      checkAccess();
    }
  }, [pathname, isPrivateRoute, userRoles]);

  const checkAccess = async () => {
    const now = Date.now();
    const accessTokenExpiryDate = new Date(accessTokenExpiry).getTime();
    const refreshTokenExpiryDate = new Date(refreshTokenExpiry).getTime();
    console.log(now, accessTokenExpiryDate, refreshTokenExpiryDate);

    if (accessTokenExpiryDate > now) {
      // Access token is valid
      console.log("Access token valid");
      if (userHasAccess()) {
        console.log("User has access");
        // do nothing
        return;
      } else {
        showPageNotFound();
        console.log("show page not found");
      }
    } else {
      // Access token is expired
      console.log("Access token expired");
      if (refreshTokenExpiryDate > now) {
        // Refresh token is valid
        refreshTokens(refreshToken);
      } else {
        // Refresh token is expired, log out
        logout();
        console.log("Refresh token expired, log out");
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
    if ("/customer/profile" === pathname) {
      return userRoles.includes("CUSTOMER");
    }
  };

  const showPageNotFound = () => {
    router.replace("/404");
  };
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
