"use client";

import useAuth from "@/hooks/useAuth";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useEffect, useState } from "react";
import { Spinner } from "../ui/spinner";
import { useUserStore } from "@/store/userStore";
import { AutoConnect } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { client } from "@/app/thirdweb";
import { usePathname, useRouter } from "next/navigation";
import { USER_ROLE } from "@/models/role";
import { toast } from "sonner";

type Props = {
  children?: React.ReactNode;
};
const AuthWrapper: React.FC<Props> = ({ children }) => { //TODO: Convert this to a provider
  const userStore = useUserStore();

  const { user, isLoading, error, accessToken: token, logout } = useAuth();
  const [requestedRoute, setRequestedRoute] = useState<
    "customer" | "company" | null
  >(null);
  const [accessToken, setAccessToken] = useLocalStorage(
    "accessToken",
    undefined
  );

  const router = useRouter();
  const pathname = usePathname();
  const wallets = [createWallet("io.metamask")];

  const isCustomerRoute = pathname.includes("/customer");
  const isCompanyRoute = pathname.includes("/company");

  const redirectToVerifyWalletRouteIfUnApproved = () => {
    if (!user || !user.isWalletApproved) {
      if (requestedRoute === "customer") {
        router.push("/customer/verify");
      }
      if (requestedRoute === "company") {
        router.push("/company/verify");
      }
    }
  };

  const isAuthorized = (role: (typeof USER_ROLE)[keyof typeof USER_ROLE]) => {
    if (!user) return false;
    if (!user.roles) return false;
    return user.roles.includes(String(role));
  };

  const redirectToDashboardIfApproved = () => {
    if (user && user.isWalletApproved) {
      if (requestedRoute === "customer") {
        if (!isAuthorized(USER_ROLE.CUSTOMER)) {
          logout();
          toast.error("Unauthorized");
          return;
        }
        router.push("/customer/dashboard");
      }
      if (requestedRoute === "company") {
        if (!isAuthorized(USER_ROLE.COMPANY)) {
          logout();
          toast.error("Unauthorized");
          return;
        }
        router.push("/company/dashboard");
      }
    }
  };

  useEffect(() => {
    if (isCustomerRoute) {
      setRequestedRoute("customer");
    }
    if (isCompanyRoute) {
      setRequestedRoute("company");
    }
  }, [pathname]);

  useEffect(() => {
    if (!user) return;
    userStore.setUser(user);
  }, [user]);

  useEffect(() => {
    if (!token) return;
    setAccessToken(token);
  }, [token]);

  useEffect(() => {
    if(!user) return;
    console.log('handle redirection', user, 'user found')
    redirectToVerifyWalletRouteIfUnApproved();
    redirectToDashboardIfApproved();
  }, [user, error]);

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
