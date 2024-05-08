"use client";

import useAuth from "@/hooks/useAuth";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useEffect } from "react";
import { Spinner } from "../ui/spinner";
import { useUserStore } from "@/store/userStore";
import { AutoConnect, useActiveAccount } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { client } from "@/app/thirdweb";
import { useRouter } from "next/navigation";

type Props = {
  children?: React.ReactNode;
};
const AuthWrapper: React.FC<Props> = ({ children }) => {
  const activeAccount = useActiveAccount();
  const userStore = useUserStore();
  const { user, isLoading, error, accessToken: token } = useAuth();
  const [accessToken, setAccessToken] = useLocalStorage(
    "accessToken",
    undefined
  );
  const router = useRouter();
  const wallets = [createWallet("io.metamask")];

  const redirectToVerifyWalletRoute = () => {
    if (!user || !user.isWalletApproved) {
      router.push("/v2/verify-wallet");
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
    redirectToVerifyWalletRoute();
  }, [user, error]);

  useEffect(() => {
    if (!activeAccount) {
      // act as logout
      userStore.setUser(null);
      setAccessToken(null);
      router.push("/v2");
    }
  }, [activeAccount]);

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
