"use client";

import FloatingConnect from "@/components/floating-connect";
import VerifyWallet from "@/components/verify-wallet";
import useLocalStorage from "@/hooks/useLocalStorage";
import {
  requestWalletVerification,
  verifyCustomerWalletSignature,
} from "@/lib/api-requests";
import { useUserStore } from "@/store/userStore";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useActiveAccount } from "thirdweb/react";

const VerifyCustomerWalletPage = () => {
  const activeAccount = useActiveAccount();
  const [verificationMessage, setVerificationMessage] = useState<string[]>([]);
  const [accessToken, setAccessToken] = useLocalStorage("accessToken", "");
  const userStore = useUserStore();
  const router = useRouter();
  const handleRequestVerification = () => {
    if (!activeAccount) return;
    requestWalletVerificationMutation.mutate(
      {
        walletAddress: activeAccount.address,
      },
      {
        onSuccess: (response) => {
          setVerificationMessage(response.data.message);
        },
        onError: () => {
          toast.error("Failed to request verification");
        },
      }
    );
  };
  const handleSignAndVerify = async () => {
    if (!activeAccount) return;
    const walletSignature = await activeAccount?.signMessage({
      message: verificationMessage.join(" "),
    });
    walletSignatureVerficationMutation.mutate(
      {
        walletAddress: activeAccount.address,
        message: verificationMessage.join(" "),
        signature: walletSignature,
      },
      {
        onSuccess: (response) => {
          const { user, accessToken } = response.data;
          toast.success("Wallet verified successfully");
          setAccessToken(accessToken);
          userStore.setUser(user);

          if (user.isWalletApproved) {
            router.push("/customer/dashboard");
          } else {
            router.push("/customer/verify");
          }
        },
        onError: () => {
          toast.error("Failed to verify wallet");
        },
      }
    );
  };

  const requestWalletVerificationMutation = useMutation({
    mutationFn: requestWalletVerification,
  });

  const walletSignatureVerficationMutation = useMutation({
    mutationFn: verifyCustomerWalletSignature,
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
        onClickSignAndVerify={handleSignAndVerify}
        verificationMessage={verificationMessage}
      />
    </main>
  );
};

export default VerifyCustomerWalletPage;
