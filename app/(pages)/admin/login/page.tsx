"use client";

import { connectWallet } from "@/app/contract-utils";
import LoginAdmin from "@/components/login-admin";
import useLocalStorage from "@/hooks/useLocalStorage";
import { apiService } from "@/services/api.service";
import { useUserStore } from "@/store/userStore";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useActiveAccount, useConnect } from "thirdweb/react";

const AdminLoginPage = () => {
  const { connect } = useConnect();
  const activeAccount = useActiveAccount();
  const [accessToken, setAccessToken] = useLocalStorage("accessToken", "");
  const [loginRequested, setLoginRequested] = useState(false);
  const router = useRouter();
  const userStore = useUserStore();
  const verifyAddressStep1Mutation = useMutation({
    mutationFn: apiService.adminVerifyWalletStep1,
  });

  const handleLoginAdmin = async () => {
    setLoginRequested(true);
    await connectWallet(connect);
  };

  const redirectToVerification = () => {
    router.push("/admin/verify");
  };

  useEffect(() => {
    if (activeAccount && loginRequested) {
      redirectToVerification();
      return;
    }
  }, [activeAccount]);

  return (
    <main>
      <LoginAdmin
        onClickConnectWallet={handleLoginAdmin}
        loading={verifyAddressStep1Mutation.isPending}
      />
    </main>
  );
};

export default AdminLoginPage;
