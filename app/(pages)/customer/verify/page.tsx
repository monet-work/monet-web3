"use client";

import FloatingConnect from "@/components/floating-connect";
import VerifyWallet from "@/components/verify-wallet";
import { apiService } from "@/services/api.service";
import { useUserStore } from "@/store/userStore";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { useActiveAccount } from "thirdweb/react";

const VerifyCustomerWalletPage = () => {
  const activeAccount = useActiveAccount();

  useEffect(() => {
    if (!activeAccount) {
      router.push("/customer/login");
    }
  }, []);

  useEffect(() => {
    if (activeAccount) {
      if (userStore.isRegistered) {
        router.push("/customer/submit-request");
      } else {
        handleRequestVerification();
      }
    }
  }, [activeAccount]);

  const userStore = useUserStore();
  const router = useRouter();
  const handleRequestVerification = () => {
    if (!activeAccount) return;
    requestWalletVerificationMutation.mutate(activeAccount.address, {
      onSuccess: (response) => {
        const { isRegistered, words } = response.data;

        userStore.setVerificationWords(words);
        userStore.setIsRegistered(isRegistered);
        toast.success("Wallet verified successfully");
        router.push("/customer/submit-request");
      },
      onError: (error) => {
        console.log(error, "error");
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
