"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import useLocalStorage from "@/hooks/useLocalStorage";
import { LOCALSTORAGE_KEYS } from "@/models/browser-storage-keys";
import { apiService } from "@/services/api.service";
import { ROUTES_CONFIG } from "@/config/routes.config";
import { matchesDynamicRoute } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Role } from "@/models/role.model";
import {
  AutoConnect,
  useActiveAccount,
  useActiveWallet,
  useActiveWalletConnectionStatus,
  useDisconnect,
  useActiveWalletChain,
  useSwitchActiveWalletChain,
} from "thirdweb/react";
import { client } from "@/app/contract-utils";
import { createWallet } from "thirdweb/wallets";
import PageLoader from "@/components/page-loader";
import useRole from "@/hooks/useRole";
import UnauthorizedAccess from "@/components/unauthorized";
import { useUserStore } from "@/store/userStore";
import { AxiosError } from "axios";
import AccountSwitcher from "@/components/account-switcher";
import { baseSepolia } from "thirdweb/chains";
import ChainSwitcher from "@/components/chain-switcher";

interface AuthContextType {
  isAuthLoading: boolean;
  logout: () => void;
  hasRole: (requiredRoles: Role["role"][]) => boolean;
  activeWalletChanged: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const useAuthProvider = () => {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const userStore = useUserStore();
  const { hasRole } = useRole();
  const router = useRouter();
  const wallet = useActiveWallet();
  const { disconnect } = useDisconnect();
  const activeAccount = useActiveAccount();
  const connectionStatus = useActiveWalletConnectionStatus();
  const chainId = useActiveWalletChain();

  const [activeWalletChanged, setActiveWalletChanged] = useState(false);
  const [activeChainChanged, setActiveChainChanged] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [userWallerAddress, setUserWalletAddress] = useState("");
  const [accessToken, setAccessToken] = useLocalStorage(
    LOCALSTORAGE_KEYS.ACCESS_TOKEN,
    { token: "", expires: "" }
  );
  const [refreshToken, setRefreshToken] = useLocalStorage(
    LOCALSTORAGE_KEYS.REFRESH_TOKEN,
    { token: "", expires: "" }
  );

  const isProtectedRoute = ROUTES_CONFIG.protectedRoutes.some((route) =>
    matchesDynamicRoute(pathname, route.path)
  );

  const {
    data: authResponse,
    isLoading: isAuthLoading,
    error: authError,
    isError: isAuthError,
    refetch,
  } = useQuery({
    queryKey: ["auth"],
    queryFn: apiService.authenticate,
    enabled: isProtectedRoute && !userStore.user,
    retry: false,
  });

  const refreshTokensMutation = useMutation({
    mutationFn: apiService.refreshToken,
    onSuccess: (response) => {
      queryClient.invalidateQueries("auth" as any);
      setAccessToken(response.data.access);
      setRefreshToken(response.data.refresh);
      refetch(); // Refetch the auth query after successful refresh
    },
    onError: (error) => {
      console.error(error);
      logout();
    },
  });

  const logout = () => {
    localStorage.clear();
    router.replace("/");
    wallet && disconnect(wallet);
  };

  useEffect(() => {
    if (authResponse && authResponse.data) {
      userStore.setUser(authResponse.data);
    }
  }, [authResponse]);

  useEffect(() => {
    if (authError) {
      if (!refreshToken || !refreshToken.token) return;
      if ((authError as AxiosError)?.response?.status === 401) {
        refreshTokensMutation.mutate(refreshToken.token);
      }
    }
  }, [authError]);

  useEffect(() => {
    if (!chainId) return;
    if (chainId.id != baseSepolia.id) {
      setActiveChainChanged(true);
    } else {
      setActiveChainChanged(false);
    }
  }, [chainId]);

  useEffect(() => {
    if (!activeAccount) return;
    if (!userWallerAddress) {
      setUserWalletAddress(activeAccount.address);
      return;
    }
    if (activeAccount.address !== userWallerAddress) {
      setActiveWalletChanged(true);
    }
  }, [activeAccount]);

  useEffect(() => {
    if (connectionStatus === "connected") {
      setWalletConnected(true);
    }
  }, [connectionStatus]);

  useEffect(() => {
    if (activeWalletChanged) {
      setActiveWalletChanged(false);
    }
  }, [activeAccount]);

  useEffect(() => {
    if (!activeAccount && walletConnected) {
      setWalletConnected(false);
      logout();
    }
  }, [connectionStatus, activeAccount]);

  return {
    isAuthLoading,
    logout,
    hasRole,
    isProtectedRoute,
    authResponse,
    activeWalletChanged,
    activeChainChanged,
    setActiveChainChanged,
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    isAuthLoading,
    logout,
    hasRole,
    isProtectedRoute,
    authResponse,
    activeWalletChanged,
    activeChainChanged,
    setActiveChainChanged,
  } = useAuthProvider();

  const userStore = useUserStore();

  const wallets = [createWallet("io.metamask")];

  if (isAuthLoading && isProtectedRoute) {
    return <PageLoader />;
  }

  const userRoles = userStore?.user?.roles.map((role) => role.role);

  const renderContent = () => {
    if (!isProtectedRoute) {
      return children;
    }

    if (isAuthLoading) {
      return <PageLoader />;
    }

    if (activeWalletChanged) {
      return <AccountSwitcher />;
    }

    if (activeChainChanged) {
      return <ChainSwitcher setActiveChainChanged={setActiveChainChanged} />;
    }

    if (authResponse) {
      const formattedRoles = authResponse.data.roles.map((role) => role.role);
      if (formattedRoles && hasRole(formattedRoles)) {
        return children;
      }
      console.log("unauthorized for no role match");
      return <UnauthorizedAccess />;
    }
    return <UnauthorizedAccess />;
  };

  return (
    <AuthContext.Provider
      value={{ logout, isAuthLoading, hasRole, activeWalletChanged }}
    >
      <AutoConnect wallets={wallets} client={client} />
      {renderContent()}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
