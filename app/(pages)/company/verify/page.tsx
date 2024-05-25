"use client";

import FloatingConnect from "@/components/floating-connect";
import VerifyWallet from "@/components/verify-wallet";
import useLocalStorage from "@/hooks/useLocalStorage";
import { verifyCompanyWalletSignature } from "@/lib/api-requests";
import { apiService } from "@/services/api.service";
import { useUserStore } from "@/store/userStore";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useActiveAccount } from "thirdweb/react";

const VerifyConpanyWalletPage = () => {
  const activeAccount = useActiveAccount();
  const userStore = useUserStore();
  const router = useRouter();
  const handleRequestVerification = () => {
    if (!activeAccount) return;
    requestWalletVerificationMutation.mutate(activeAccount.address, {
      onSuccess: (response) => {
        userStore.setVerificationWords(response.data.words);
        router.push("/company/submit-request");
      },
      onError: () => {
        toast.error("Failed to request verification");
      },
    });
  };
  // const handleSignAndVerify = async () => {
  //   if (!activeAccount) return;
  //   const walletSignature = await activeAccount?.signMessage({
  //     message: verificationMessage!,
  //   });
  //   walletSignatureVerficationMutation.mutate(
  //     {
  //       walletAddress: activeAccount.address,
  //       message: verificationMessage!,
  //       signature: walletSignature,
  //     },
  //     {
  //       onSuccess: (response) => {
  //         const { user, accessToken } = response.data;
  //         toast.success("Wallet verified successfully");
  //         setAccessToken(accessToken);
  //         userStore.setUser(user);

  //         if (user.isWalletApproved) {
  //           router.push("/company/dashboard");
  //         } else {
  //           router.push("/company/verify");
  //         }
  //       },
  //       onError: () => {
  //         toast.error("Failed to verify wallet");
  //       },
  //     }
  //   );
  // };

  const requestWalletVerificationMutation = useMutation({
    mutationFn: apiService.companyVerifyWalletStep1,
  });

  const walletSignatureVerficationMutation = useMutation({
    mutationFn: verifyCompanyWalletSignature,
  });

  return (
    <main>
      <FloatingConnect />
      <VerifyWallet
        loading={
          requestWalletVerificationMutation.isPending ||
          walletSignatureVerficationMutation.isPending
        }
        onClickRequestVerification={handleRequestVerification}
      />
    </main>
  );
};

export default VerifyConpanyWalletPage;
