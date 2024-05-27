"use client";

import FloatingConnect from "@/components/floating-connect";
import VerifyWallet from "@/components/verify-wallet";
import useLocalStorage from "@/hooks/useLocalStorage";
import { apiService } from "@/services/api.service";
import { useUserStore } from "@/store/userStore";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useActiveAccount } from "thirdweb/react";

const VerifyAdminWalletPage = () => {
  const activeAccount = useActiveAccount();
  const userStore = useUserStore();
  const router = useRouter();
  const [accessToken, setAccessToken] = useLocalStorage("accessToken", null);
  const [refreshToken, setRefreshToken] = useLocalStorage("refreshToken", null);

  const handleRequestVerification = () => {
    if (!activeAccount) return;
    requestWalletVerificationMutation.mutate(activeAccount.address, {
      onSuccess: (response) => {
        const { isRegistered, words } = response.data;

        if (isRegistered && accessToken && refreshToken) {
          router.push("/admin/dashboard");
          return;
        }

        userStore.setVerificationWords(words);
        router.push("/admin/submit-request");
      },
      onError: () => {
        toast.error("Failed to request verification");
      },
    });
  };

  const requestWalletVerificationMutation = useMutation({
    mutationFn: apiService.AdminVerifyWalletStep1,
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

export default VerifyAdminWalletPage;
