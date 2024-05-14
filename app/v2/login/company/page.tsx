"use client";

import { connectWallet } from "@/app/thirdweb";
import ConnectWallet from "@/components/v2/connect-wallet";
import useLocalStorage from "@/hooks/useLocalStorage";
import { login } from "@/lib/api-requests";
import { USER_ROLE } from "@/models/role";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useActiveAccount, useConnect } from "thirdweb/react";

const CompanyLoginPage = () => {
  const { connect, isConnecting, error } = useConnect();
  const account = useActiveAccount();
  const router = useRouter();
  const [roleRequested, setRoleRequested] = useLocalStorage(
    "roleRequested",
    ""
  );
  const [accessToken, setAccessToken] = useLocalStorage(
    "accessToken",
    undefined
  );

  const loginMutation = useMutation({
    mutationFn: login,
  });

  useEffect(() => {
    if (!account) return;

    loginMutation.mutate(
      {
        walletAddress: account.address,
      },
      {
        onSuccess: (response) => {
          const accessToken = response.data.accessToken;
          if (accessToken) {
            setAccessToken(accessToken);
            router.push("/v2/dashboard/company");
          }
        },
        onError: (error) => {
          router.push("/v2/verify-wallet");
        },
      }
    );
  }, [account]);

  return (
    <main className="min-h-screen bg-primary flex justify-center items-center">
      <ConnectWallet
        onClickConnect={() => {
          setRoleRequested(USER_ROLE.COMPANY);
          connectWallet(connect);
        }}
        isConnecting={isConnecting}
      />
    </main>
  );
};

export default CompanyLoginPage;
