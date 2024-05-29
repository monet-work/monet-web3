"use client";

import CompanySubmitRequest from "@/components/company-submit-request";
import FloatingConnect from "@/components/floating-connect";
import LoadingMessage from "@/components/loading-message";
import useLocalStorage from "@/hooks/useLocalStorage";
import { LOCALSTORAGE_KEYS } from "@/models/tokens";
import { apiService } from "@/services/api.service";
import { useUserStore } from "@/store/userStore";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { useActiveAccount } from "thirdweb/react";

const SubmitRequestPage: React.FC = () => {
  const userStore = useUserStore();
  const router = useRouter();
  const activeAccount = useActiveAccount();
  const [accessToken, setAccessToken] = useLocalStorage(LOCALSTORAGE_KEYS.ACCESS_TOKEN, "");
  const [refreshToken, setRefreshToken] = useLocalStorage(LOCALSTORAGE_KEYS.REFRESH_TOKEN, "");


  const walletSignatureVerficationMutation = useMutation({
    mutationFn: apiService.companyVerifyWalletStep2,
  });

  useEffect(() => {
    if (!userStore.verificationWords) {
      // Redirect to verify page
      router.push("/company/verify");
    }
  }, [userStore.verificationWords]);
  return (
    <main>
      <FloatingConnect />
      {userStore.verificationWords ? (
        <CompanySubmitRequest
          loading={walletSignatureVerficationMutation.isPending}
          verificationMessage={userStore.verificationWords}
          onClickSubmitRequest={async (values) => {
            const { name, email, pointName, pointSymbol, description, decimal } = values;
            if (!userStore.verificationWords) return;

            if (!activeAccount) return;
            const walletSignature = await activeAccount?.signMessage({
              message: userStore.verificationWords!,
            });

            walletSignatureVerficationMutation.mutate(
              {
                name,
                email,
                pointName,
                pointSymbol,
                description,
                decimal,
                words: userStore.verificationWords,
                signature: walletSignature,
                walletAddress: activeAccount.address,
              },
              {
                onSuccess: (res) => {
                  const { company, tokens } = res.data;
                  toast.success("Wallet verified successfully");
                  setAccessToken(tokens.access);
                  setRefreshToken(tokens.refresh);

                  if (company) {
                    router.push("/company/dashboard");
                  }
                },
                onError: (error) => {},
              }
            );
          }}
        />
      ) : (
        <div>
          <LoadingMessage />
        </div>
      )}
    </main>
  );
};

export default SubmitRequestPage;
