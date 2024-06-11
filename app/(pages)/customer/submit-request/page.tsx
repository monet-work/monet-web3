"use client";
import CustomerSubmitRequest from "@/components/customer-submit-request";
import FloatingConnect from "@/components/floating-connect";
import LoadingMessage from "@/components/loading-message";
import useLocalStorage from "@/hooks/useLocalStorage";
import { LOCALSTORAGE_KEYS } from "@/models/browser-storage-keys";
import { apiService } from "@/services/api.service";
import useCustomerStore from "@/store/customerStore";
import { useUserStore } from "@/store/userStore";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useActiveAccount } from "thirdweb/react";

const SubmitRequestPage: React.FC = () => {
  const userStore = useUserStore();
  const customerStore = useCustomerStore();
  const router = useRouter();
  const activeAccount = useActiveAccount();
  const [loader, setLoader] = useState(false);
  const [accessTokenData, setAccessTokenData] = useLocalStorage(
    LOCALSTORAGE_KEYS.ACCESS_TOKEN,
    { token: "", expires: 0 }
  );

  const [refreshTokenData, setRefreshTokenData] = useLocalStorage(
    LOCALSTORAGE_KEYS.REFRESH_TOKEN,
    { token: "", expires: 0 }
  );

  const walletSignatureVerficationMutation = useMutation({
    mutationFn: apiService.customerVerifyWalletStep2,
  });

  useEffect(() => {
    if (!userStore.verificationWords) {
      // Redirect to verify page
      router.push("/customer/verify");
    }
  }, [userStore.verificationWords]);
  return (
    <main>
      <FloatingConnect />
      {userStore.verificationWords ? (
        <CustomerSubmitRequest
          loading={walletSignatureVerficationMutation.isPending || loader}
          verificationMessage={userStore.verificationWords}
          onClickSubmitRequest={async (values) => {
            const { email, name } = values;
            if (!userStore.verificationWords) return;

            if (!activeAccount) return;
            setLoader(true);
            const walletSignature = await activeAccount?.signMessage({
              message: userStore.verificationWords!,
            });

            walletSignatureVerficationMutation.mutate(
              {
                email,
                name,
                words: userStore.verificationWords,
                signature: walletSignature,
                walletAddress: activeAccount.address,
              },
              {
                onSuccess: (res) => {
                  const { customer, tokens } = res.data;
                  toast.success("Wallet verified successfully");
                  setAccessTokenData({
                    token: tokens.access.token,
                    expires: tokens.access.expires,
                  });
                  setRefreshTokenData({
                    token: tokens.refresh.token,
                    expires: tokens.refresh.expires,
                  });
                  customerStore.setCustomer(customer);
                  setLoader(false);

                  if (customer) {
                    router.push("/customer/dashboard");
                  }
                },
                onError: (error) => {
                  toast.error(error.message);
                  setLoader(false);
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
