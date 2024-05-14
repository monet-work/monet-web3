"use client";

import { connectWallet } from "@/app/thirdweb";
import LoginCustomer from "@/components/login-customer";
import useLocalStorage from "@/hooks/useLocalStorage";
import { login } from "@/lib/api-requests";
import { useUserStore } from "@/store/userStore";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useActiveAccount, useConnect } from "thirdweb/react";

const CustomerLoginPage = () => {
  const { connect } = useConnect();
  const activeAccount = useActiveAccount();
  const [accessToken, setAccessToken] = useLocalStorage("accessToken", "");
  const [loginRequested, setLoginRequested] = useState(false);
  const router = useRouter();
  const userStore = useUserStore();
  const loginMutation = useMutation({
    mutationFn: login,
  });

  const handleLoginCustomer = async () => {
    setLoginRequested(true);
    await connectWallet(connect);
  };

  useEffect(() => {
    if (activeAccount && loginRequested) {
      loginMutation.mutate(
        {
          walletAddress: activeAccount.address,
        },
        {
          onSuccess: (response) => {
            const { accessToken, user } = response.data;
            setAccessToken(accessToken);
            userStore.setUser(user);
            if (user.isWalletApproved) {
              router.push("/customer/dashboard");
            } else {
              router.push("/customer/verify");
            }
          },
          onError: () => {
            router.push("/customer/verify");
          },
        }
      );
    }
  }, [activeAccount]);

  return (
    <main>
      <LoginCustomer
        onClickConnectWallet={handleLoginCustomer}
        loading={loginMutation.isPending}
      />
    </main>
  );
};

export default CustomerLoginPage;
