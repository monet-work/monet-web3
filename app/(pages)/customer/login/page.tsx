"use client";

import { connectWallet } from "@/app/contract-utils";
import LoginCustomer from "@/components/login-customer";
import useLocalStorage from "@/hooks/useLocalStorage";
import { login } from "@/lib/api-requests";
import { LOCALSTORAGE_KEYS } from "@/models/tokens";
import { useUserStore } from "@/store/userStore";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useActiveAccount, useConnect } from "thirdweb/react";

const CustomerLoginPage = () => {
  const { connect } = useConnect();
  const activeAccount = useActiveAccount();
  const [accessToken, setAccessToken] = useLocalStorage(
    LOCALSTORAGE_KEYS.ACCESS_TOKEN,
    ""
  );
  const [loginRequested, setLoginRequested] = useState(false);
  const router = useRouter();
  const userStore = useUserStore();
  const authMutation = useMutation({
    // mutationFn: authenticate,
  });

  const handleLoginCustomer = async () => {
    setLoginRequested(true);
    await connectWallet(connect);
  };

  const redirectToVerfication = () => {
    router.push("/customer/verify");
  };

  useEffect(() => {
    if (activeAccount && loginRequested) {
      if (!accessToken) {
        redirectToVerfication();
      }
    }
  }, [activeAccount]);

  return (
    <main>
      <LoginCustomer
        onClickConnectWallet={handleLoginCustomer}
        loading={authMutation.isPending}
      />
    </main>
  );
};

export default CustomerLoginPage;
