"use client";

import CompanySubmitRequest from "@/components/company-submit-request";
import FloatingConnect from "@/components/floating-connect";
import LoadingMessage from "@/components/loading-message";
import useLocalStorage from "@/hooks/useLocalStorage";
import { LOCALSTORAGE_KEYS } from "@/models/tokens";
import { apiService } from "@/services/api.service";
import { useCompanyStore } from "@/store/companyStore";
import { useUserStore } from "@/store/userStore";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useActiveAccount } from "thirdweb/react";

const SubmitRequestPage: React.FC = () => {
  const userStore = useUserStore();
  const companyStore = useCompanyStore();
  const router = useRouter();
  const activeAccount = useActiveAccount();
  const [loader, setLoader] = useState(false);
  const [accessTokenData, setAccessTokenData] = useLocalStorage(
    LOCALSTORAGE_KEYS.ACCESS_TOKEN_DATA,
    { token: "", expiry: 0 }
  );

  const [refreshTokenData, setRefreshTokenData] = useLocalStorage(
    LOCALSTORAGE_KEYS.REFRESH_TOKEN_DATA,
    { token: "", expiry: 0 }
  );

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
          loading={walletSignatureVerficationMutation.isPending || loader}
          verificationMessage={userStore.verificationWords}
          onClickSubmitRequest={async (values) => {
            const {
              name,
              email,
              pointName,
              pointSymbol,
              description,
              decimal,
            } = values;
            if (!userStore.verificationWords) return;

            if (!activeAccount) return;

            setLoader(true);
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
                  setAccessTokenData({
                    token: tokens.access.token,
                    expiry: tokens.access.expires,
                  });
                  setRefreshTokenData({
                    token: tokens.refresh.token,
                    expiry: tokens.refresh.expires,
                  });
                  companyStore.setCompany(company);

                  setLoader(false);

                  if (company) {
                    router.push("/company/dashboard");
                  }
                },
                onError: (error) => {
                  setLoader(false);
                  toast.error(error.message);
                },
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
