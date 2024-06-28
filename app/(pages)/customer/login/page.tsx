"use client";

import { connectWallet } from "@/app/contract-utils";
import LoginCustomer from "@/components/login-customer";
import MetaMaskDownloader from "@/components/metamask-download";
import useIsWalletInstalled from "@/hooks/useIsWalletInstalled";
import useLocalStorage from "@/hooks/useLocalStorage";
import { LOCALSTORAGE_KEYS } from "@/models/browser-storage-keys";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useActiveAccount, useConnect } from "thirdweb/react";

const CustomerLoginPage = () => {
  const { connect, isConnecting } = useConnect();
  const activeAccount = useActiveAccount();
  const [accessToken, setAccessToken] = useLocalStorage(
    LOCALSTORAGE_KEYS.ACCESS_TOKEN,
    { token: "", expires: 0 },
  );
  const [loginRequested, setLoginRequested] = useState(false);
  const router = useRouter();
  const userStore = useUserStore();
  const isInstalled = useIsWalletInstalled({ flag: "isMetaMask" });
  const [showModal, setShowModal] = useState(isInstalled === false);
  useEffect(() => {
    setShowModal(isInstalled === false);
  }, [isInstalled]);

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
      {loginRequested && showModal && (
        <MetaMaskDownloader setLoginRequested={setLoginRequested} />
      )}
      <LoginCustomer
        onClickConnectWallet={handleLoginCustomer}
        loading={isConnecting}
      />
    </main>
  );
};

export default CustomerLoginPage;
