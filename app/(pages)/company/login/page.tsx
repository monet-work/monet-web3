"use client";

import { connectWallet } from "@/app/thirdweb";
import LoginCompany from "@/components/login-company";
import useLocalStorage from "@/hooks/useLocalStorage";
import { LOCALSTORAGE_KEYS } from "@/models/tokens";
import { apiService } from "@/services/api.service";
import { useUserStore } from "@/store/userStore";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useActiveAccount, useConnect } from "thirdweb/react";

const CompanyLoginPage = () => {
  const { connect } = useConnect();
  const activeAccount = useActiveAccount();
  const [accessToken, setAccessToken] = useLocalStorage(LOCALSTORAGE_KEYS.ACCESS_TOKEN, "");
  const [refreshToken, setRefreshToken] = useLocalStorage(LOCALSTORAGE_KEYS.REFRESH_TOKEN, "");
  const [loginRequested, setLoginRequested] = useState(false);
  const router = useRouter();
  const userStore = useUserStore();
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

  const redirectToDashboard = () => {
    router.push("/company/dashboard");
  };

  useEffect(() => {
    if (activeAccount && loginRequested) {
      redirectToVerification();
      return;
    }
  }, [activeAccount]);

  return (
    <main>
      <LoginCompany
        onClickConnectWallet={handleLoginCompany}
        loading={verifyAddressStep1Mutation.isPending}
      />
    </main>
  );
};

export default CompanyLoginPage;
