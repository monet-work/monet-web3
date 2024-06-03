"use client";

import AdminSubmitRequest from "@/components/admin-submit-request";
import FloatingConnect from "@/components/floating-connect";
import LoadingMessage from "@/components/loading-message";
import useLocalStorage from "@/hooks/useLocalStorage";
import { LOCALSTORAGE_KEYS } from "@/models/tokens";
import { apiService } from "@/services/api.service";
import { useAdminStore } from "@/store/adminStore";
import { useUserStore } from "@/store/userStore";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { useActiveAccount } from "thirdweb/react";

const SubmitRequestPage: React.FC = () => {
  const userStore = useUserStore();
  const adminStore = useAdminStore();
  const router = useRouter();
  const activeAccount = useActiveAccount();

  const [accessTokenData, setAccessTokenData] = useLocalStorage(
    LOCALSTORAGE_KEYS.ACCESS_TOKEN_DATA,
    { token: "", expiry: 0 }
  );

  const [refreshTokenData, setRefreshTokenData] = useLocalStorage(
    LOCALSTORAGE_KEYS.REFRESH_TOKEN_DATA,
    { token: "", expiry: 0 }
  );

  const walletSignatureVerficationMutation = useMutation({
    mutationFn: apiService.adminVerifyWalletStep2,
  });

  useEffect(() => {
    if (!userStore.verificationWords) {
      // Redirect to verify page
      router.push("/admin/verify");
    }
  }, [userStore.verificationWords]);
  return (
    <main>
      <FloatingConnect />
      {userStore.verificationWords ? (
        <AdminSubmitRequest
          loading={walletSignatureVerficationMutation.isPending}
          verificationMessage={userStore.verificationWords}
          onClickSubmitRequest={async () => {
            if (!userStore.verificationWords) return;

            if (!activeAccount) return;
            const walletSignature = await activeAccount?.signMessage({
              message: userStore.verificationWords!,
            });

            walletSignatureVerficationMutation.mutate(
              {
                words: userStore.verificationWords,
                wallet: activeAccount.address,
                signature: walletSignature,
              },
              {
                onSuccess: (res) => {
                  const { admin, tokens } = res.data;
                  toast.success("Wallet verified successfully");
                  setAccessTokenData({
                    token: tokens.access.token,
                    expiry: tokens.access.expires,
                  });
                  setRefreshTokenData({
                    token: tokens.refresh.token,
                    expiry: tokens.refresh.expires,
                  });
                  adminStore.setAdmin(admin);

                  if (admin) {
                    router.push("/admin/dashboard");
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
