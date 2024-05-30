"use client";

import FloatingConnect from "@/components/floating-connect";
import VerifyWallet from "@/components/verify-wallet";
import useLocalStorage from "@/hooks/useLocalStorage";
import { LOCALSTORAGE_KEYS } from "@/models/tokens";
import { apiService } from "@/services/api.service";
import { useUserStore } from "@/store/userStore";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useActiveAccount } from "thirdweb/react";

const VerifyCustomerWalletPage = () => {
  const activeAccount = useActiveAccount();
  const [verificationMessage, setVerificationMessage] = useState<string[]>([]);
  const [accessToken, setAccessToken] = useLocalStorage(
    LOCALSTORAGE_KEYS.ACCESS_TOKEN,
    ""
  );

  useEffect(() => {
    if (!activeAccount) {
      router.push("/customer/login");
    }
  }, []);

  const userStore = useUserStore();
  const router = useRouter();
  const handleRequestVerification = () => {
    if (!activeAccount) return;
    requestWalletVerificationMutation.mutate(activeAccount.address, {
      onSuccess: (response) => {
        const { isRegistered, words } = response.data;

        userStore.setVerificationWords(words);
        userStore.setIsRegistered(isRegistered);
        router.push("/customer/submit-request");
      },
      onError: () => {
        toast.error("Failed to request verification");
      },
    });
  };

  const requestWalletVerificationMutation = useMutation({
    mutationFn: apiService.customerVerifyWalletStep1,
  });

  return (
    <main>
      <FloatingConnect />
      <VerifyWallet
        loading={requestWalletVerificationMutation.isPending}
        onClickRequestVerification={handleRequestVerification}
      />
    </main>
  );
};

export default VerifyCustomerWalletPage;
