"use client";

import { connectWallet } from "@/app/thirdweb";
import ConnectWallet from "@/components/v2/connect-wallet";
import useLocalStorage from "@/hooks/useLocalStorage";
import { login } from "@/lib/api-requests";
import { USER_ROLE } from "@/models/role";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useActiveAccount, useConnect } from "thirdweb/react";

const CustomerLoginPage = () => {
  const { connect, isConnecting, error } = useConnect();
  const account = useActiveAccount();
  const [roleRequested, setRoleRequested] = useLocalStorage(
    "roleRequested",
    ""
  );

  const loginMutation = useMutation({
    mutationFn: login,
  });

  // useEffect(() => {
  //   if (!account) return;

  //   loginMutation.mutate({
  //     walletAddress: account.address,
  //     requestedRole: roleRequested,
  //   });
  // }, [account]);

  return (
    <main className="min-h-screen bg-primary flex justify-center items-center">
      <ConnectWallet
        onClickConnect={() => {
          setRoleRequested(USER_ROLE.CUSTOMER);
          connectWallet(connect);
        }}
        isConnecting={isConnecting}
      />
    </main>
  );
};

export default CustomerLoginPage;
