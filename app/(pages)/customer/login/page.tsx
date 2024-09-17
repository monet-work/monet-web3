"use client";

import { connectWallet } from "@/app/contract-utils";
import LoginCustomer from "@/components/login-customer";
import MetaMaskDownloader from "@/components/metamask-download";
import useIsWalletInstalled from "@/hooks/useIsWalletInstalled";
import useWindowSize from "@/hooks/useWindowSize";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useActiveAccount, useConnect } from "thirdweb/react";

const CustomerLoginPage = () => {
  const { connect, isConnecting } = useConnect();
  const activeAccount = useActiveAccount();
  const [loginRequested, setLoginRequested] = useState(false);
  const router = useRouter();
  const isInstalled = useIsWalletInstalled({ flag: "isMetaMask" });
  const [showModal, setShowModal] = useState(isInstalled === false);
  useEffect(() => {
    setShowModal(isInstalled === false);
  }, [isInstalled]);

  useEffect(() => {
    if (activeAccount) {
      router.push("/customer/verify");
    }
  }, [activeAccount]);

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

  const { isMobile } = useWindowSize();

  return (
    <main>
      {!isMobile && loginRequested && showModal && (
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
