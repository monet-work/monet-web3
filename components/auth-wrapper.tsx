"use client";

import useAuth from "@/hooks/useAuth";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Spinner } from "./ui/spinner";
import { useUserStore } from "@/store/userStore";
import { AutoConnect } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { client } from "@/app/thirdweb";
import { MonetWorkLogo } from "./icons/monet-work-logo";
import { LOCALSTORAGE_KEYS } from "@/models/tokens";

type Props = {
  children?: React.ReactNode;
};
const AuthWrapper: React.FC<Props> = ({ children }) => {
  //TODO: Convert this to a provider
  const userStore = useUserStore();

  const { isLoading, error: authError, logout } = useAuth();
  const [accessToken, setAccessToken] = useLocalStorage(
    LOCALSTORAGE_KEYS.ACCESS_TOKEN,
    undefined
  );

  const wallets = [createWallet("io.metamask")];


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
