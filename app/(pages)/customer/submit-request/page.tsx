"use client";
import CustomerSubmitRequest from "@/components/customer-submit-request";
import FloatingConnect from "@/components/floating-connect";
import LoadingMessage from "@/components/loading-message";
import useHasMounted from "@/hooks/useHasMounted";
import { apiService } from "@/services/api.service";
import useLocalStorage from "@/hooks/useLocalStorage";
import { LOCALSTORAGE_KEYS } from "@/models/browser-storage-keys";
import { useUserStore } from "@/store/userStore";
import useCustomerStore from "@/store/customerStore";
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
  const hasMounted = useHasMounted();
  const [accessTokenData, setAccessTokenData] = useLocalStorage(
    LOCALSTORAGE_KEYS.ACCESS_TOKEN,
    { token: "", expires: 0 },
  );

  const [refreshTokenData, setRefreshTokenData] = useLocalStorage(
    LOCALSTORAGE_KEYS.REFRESH_TOKEN,
    { token: "", expires: 0 },
  );

  const walletSignatureVerficationMutation = useMutation({
    mutationFn: apiService.customerVerifyWalletStep2,
  });

  useEffect(() => {
    if (userStore.isRegistered && hasMounted) {
      handleWalletSignatureVerification();
    }
  }, [userStore.isRegistered, hasMounted]);

  useEffect(() => {
    if (!userStore.verificationWords) {
      // Redirect to verify page
      router.push("/customer/verify");
    }
  }, [userStore.verificationWords]);

  const handleWalletSignatureVerification = async (
    email?: string,
    name?: string,
  ) => {
    if (!userStore.verificationWords || !activeAccount) return;
    setLoader(true);

    let walletSignature = "";

    try {
      walletSignature = await activeAccount?.signMessage({
        message: userStore.verificationWords!,
      });
    } catch (error) {
      toast.error("You need to sign the message to verify your wallet.");
      setLoader(false);
      console.error(error);
    }

    if (!walletSignature) return;

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
          console.error(error);
          setLoader(false);
        },
      },
    );
  };

  return (
    <main>
      <FloatingConnect />
      {userStore.verificationWords ? (
        <CustomerSubmitRequest
          loading={walletSignatureVerficationMutation.isPending || loader}
          verificationMessage={userStore.verificationWords}
          onClickSubmitRequest={async (values) => {
            const { email, name } = values;
            handleWalletSignatureVerification(email, name);
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
