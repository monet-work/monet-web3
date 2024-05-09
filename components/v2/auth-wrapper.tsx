"use client";

import useAuth from "@/hooks/useAuth";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useEffect, useState } from "react";
import { Spinner } from "../ui/spinner";
import { useUserStore } from "@/store/userStore";
import { AutoConnect, useActiveAccount, useActiveWalletConnectionStatus } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { client } from "@/app/thirdweb";
import { useRouter } from "next/navigation";
import { USER_ROLE } from "@/models/role";

type Props = {
  children?: React.ReactNode;
};
const AuthWrapper: React.FC<Props> = ({ children }) => {
  const activeAccount = useActiveAccount();
  const connectionStatus = useActiveWalletConnectionStatus();
  const userStore = useUserStore();
  const [pageLoaded, setPageLoaded] = useState(false);
  const { user, isLoading, error, accessToken: token } = useAuth();
  const [accessToken, setAccessToken] = useLocalStorage(
    "accessToken",
    undefined
  );
  const [roleRequested, setRoleRequested] = useLocalStorage(
    "roleRequested",
    ""
  );
  const router = useRouter();
  const wallets = [createWallet("io.metamask")];

  const redirectToVerifyWalletRouteIfUnApproved = () => {
    if (!user || !user.isWalletApproved) {
      router.push("/v2/verify-wallet");
    }
  };

  const redirectToDashboardIfApproved = () => {
    if (user && user.isWalletApproved) {
      const redirectTo =
        Number(roleRequested) === USER_ROLE.CUSTOMER
          ? "/v2/dashboard/customer"
          : "/v2/dashboard/company";
    }
  };

  useEffect(() => {
    if (!user) return;
    userStore.setUser(user);
  }, [user]);

  useEffect(() => {
    if (!token) return;
    setAccessToken(token);
  }, [token]);

  useEffect(() => {
    redirectToVerifyWalletRouteIfUnApproved();
    redirectToDashboardIfApproved();
  }, [user, error]);

  useEffect(() => {
    if(connectionStatus === 'connected') {
      setPageLoaded(true);
    }
  }, [connectionStatus]);

  useEffect(() => {
    // detect logout
    if (!activeAccount && pageLoaded) {
      //logout
      console.log("logging out");
      setAccessToken(undefined);
      router.push("/v2");
      localStorage.clear();
    }
  }, [activeAccount, pageLoaded]);

  return (
    <div>
      <AutoConnect wallets={wallets} client={client} />
      {isLoading && (
        <div className="bg-primary min-h-screen flex justify-center items-center">
          <Spinner className="w-24 h-24 text-slate-200" />
        </div>
      )}

      {!isLoading && children}
    </div>
  );
};

export default AuthWrapper;
