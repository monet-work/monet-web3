"use client";

import { connectWallet } from "@/app/contract-utils";
import LoginCustomer from "@/components/login-customer";
import useLocalStorage from "@/hooks/useLocalStorage";
import { LOCALSTORAGE_KEYS } from "@/models/tokens";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useActiveAccount, useConnect } from "thirdweb/react";

const CustomerLoginPage = () => {
  const { connect, isConnecting } = useConnect();
  const activeAccount = useActiveAccount();
  const [accessToken, setAccessToken] = useLocalStorage(
    LOCALSTORAGE_KEYS.ACCESS_TOKEN_DATA,
    ""
  );
  const [loginRequested, setLoginRequested] = useState(false);
  const router = useRouter();
  const userStore = useUserStore();

  const handleLoginCustomer = async () => {
    setLoginRequested(true);
    await connectWallet(connect);
  };

  const redirectToVerfication = () => {
    router.push("/customer/verify");
  };

  useEffect(() => {
    if (activeAccount && loginRequested) {
      redirectToVerfication();
    }
  }, [activeAccount]);

  return (
    <main>
      <LoginCustomer
        onClickConnectWallet={handleLoginCustomer}
        loading={isConnecting}
      />
    </main>
  );
};

export default CustomerLoginPage;
