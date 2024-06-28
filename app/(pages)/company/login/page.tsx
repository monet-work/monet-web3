"use client";

import { connectWallet } from "@/app/contract-utils";
import LoginCompany from "@/components/login-company";
import MetaMaskDownloader from "@/components/metamask-download";
import useIsWalletInstalled from "@/hooks/useIsWalletInstalled";
import { apiService } from "@/services/api.service";
import { useUserStore } from "@/store/userStore";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useActiveAccount, useConnect } from "thirdweb/react";

const CompanyLoginPage = () => {
  const { connect, isConnecting } = useConnect();
  const activeAccount = useActiveAccount();
  const [loginRequested, setLoginRequested] = useState(false);
  const router = useRouter();
  const userStore = useUserStore();
  const isInstalled = useIsWalletInstalled({ flag: "isMetaMask" });
  const [showModal, setShowModal] = useState(isInstalled === false);
  useEffect(() => {
    setShowModal(isInstalled === false);
  }, [isInstalled]);

  const verifyAddressStep1Mutation = useMutation({
    mutationFn: apiService.companyVerifyWalletStep1,
  });

  const handleLoginCompany = async () => {
    setLoginRequested(true);
    await connectWallet(connect);
  };

  const redirectToVerification = () => {
    router.push("/company/verify");
  };

  useEffect(() => {
    if (activeAccount && loginRequested) {
      redirectToVerification();
      return;
    }
  }, [activeAccount]);

  return (
    <main>
      {loginRequested && showModal && (
        <MetaMaskDownloader setLoginRequested={setLoginRequested} />
      )}
      <LoginCompany
        onClickConnectWallet={handleLoginCompany}
        loading={verifyAddressStep1Mutation.isPending || isConnecting}
      />
    </main>
  );
};

export default CompanyLoginPage;
