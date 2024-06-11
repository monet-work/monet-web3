"use client";

import useAuth from "@/hooks/useAuth";
import { Spinner } from "./ui/spinner";
import { AutoConnect } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { client } from "@/app/contract-utils";
import PageLoader from "./page-loader";
type Props = {
  children?: React.ReactNode;
};
const AuthWrapper: React.FC<Props> = ({ children }) => {
  //TODO: Convert this to a provider

  const { isLoading } = useAuth();

  const wallets = [createWallet("io.metamask")];

  return (
    <div>
      <AutoConnect wallets={wallets} client={client} />
      {isLoading ? (
       <PageLoader />
      ) : null}

      {children}
    </div>
  );
};

export default AuthWrapper;
