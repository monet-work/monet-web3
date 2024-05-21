"use client";

import useAuth from "@/hooks/useAuth";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useEffect, useState } from "react";
import { Spinner } from "./ui/spinner";
import { useUserStore } from "@/store/userStore";
import { AutoConnect } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { client } from "@/app/thirdweb";
import { usePathname, useRouter } from "next/navigation";
import { USER_ROLE } from "@/models/role";
import { toast } from "sonner";
import { User } from "@/xata";
import { MonetWorkLogo } from "./icons/monet-work-logo";

type Props = {
  children?: React.ReactNode;
};
const AuthWrapper: React.FC<Props> = ({ children }) => {
  //TODO: Convert this to a provider
  const userStore = useUserStore();

  const {
    user,
    isLoading,
    error: authError,
    accessToken: token,
    logout,
  } = useAuth();
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

  const isAuthorized = (role: (typeof USER_ROLE)[keyof typeof USER_ROLE]) => {
    if (!user) return false;
    if (!user.roles) return false;
    return user.roles.includes(String(role));
  };

  const redirectToDashboardIfAuthorized = (user: User) => {
    if (user) {
      if (requestedRoute === "customer") {
        if (!isAuthorized(USER_ROLE.CUSTOMER)) {
          logout();
          toast.error("Unauthorized");
          return;
        } else {
          router.push("/customer/dashboard");
        }
      }
      if (requestedRoute === "company") {
        if (!isAuthorized(USER_ROLE.COMPANY)) {
          logout();
          toast.error("Unauthorized");
          return;
        } else {
          router.push("/company/dashboard");
        }
      }
    }
  };

  useEffect(() => {
    if (authError) {
      //logout
      logout();
    }
  }, [authError]);

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
    if (!user) return;
    redirectToDashboardIfAuthorized(user);
  }, [user, authError]);

  return (
    <div>
      <AutoConnect wallets={wallets} client={client} />
      {isLoading && (
        <div className="bg-black/80 backdrop-blur-sm min-h-screen flex justify-center items-center fixed top-0 left-0 w-full h-full z-50">
          <div className="flex flex-col">
            <MonetWorkLogo className="w-48 h-48" />
            <Spinner className="w-8 h-8 text-slate-200" />
          </div>
        </div>
      )}

      {children}
    </div>
  );
};

export default AuthWrapper;
