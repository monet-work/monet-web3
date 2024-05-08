'use client';

import {
  submitCompanyRequest,
  requestCompanyWalletVerfication,
} from "@/lib/api-requests";
import { useMutation } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { useState } from "react";
import { toast } from "sonner";
import { useActiveAccount } from "thirdweb/react";
import { useRouter } from "next/navigation";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useCompanyStore } from "@/store/companyStore";
import { useCustomerStore } from "@/store/customerStore";

const VerifyWallet = () => {
  const [verificationMessage, setVerificationMessage] = useState<
    string[] | undefined
  >(undefined);
  const [accessToken, setAccessToken] = useLocalStorage(
    "accessToken",
    undefined
  );

  const [roleRequested, setRoleRequested] = useLocalStorage("roleRequested", "");

  const companyStore = useCompanyStore();
  const customerStore = useCustomerStore();

  const activeAccount = useActiveAccount();
  const walletAddress = activeAccount?.address;
  const submitRequestMutation = useMutation({
    mutationFn: submitCompanyRequest,
  });

  const submitSignatureVerificationMutation = useMutation({
    mutationFn: requestCompanyWalletVerfication,
  });

  const router = useRouter();

  const requestVerfication = async () => {
    if (!walletAddress) return;
    submitRequestMutation.mutate(
      {
        walletAddress: walletAddress,
      },
      {
        onSuccess: (response) => {
          setVerificationMessage(response.data.message);
          console.log("response", verificationMessage);
          toast.success("Request submitted");
        },
        onError: (error: any) => {
          toast.error(error?.response?.data || "Failed to submit request");
        },
      }
    );
  };

  const signAndVerfiy = async () => {
    if (!verificationMessage) return;
    const walletSignature = await activeAccount?.signMessage({
      message: verificationMessage.join(" "),
    });
    if (!walletSignature) return;
    submitSignatureVerificationMutation.mutate(
      {
        walletAddress: walletAddress!,
        message: verificationMessage.join(" "),
        signature: walletSignature,
        requestedRole: roleRequested
      },
      {
        onSuccess: (response) => {
          const accessToken = response.data.accessToken;
          // const company = response.data.company;
          setAccessToken(accessToken);
          toast.success("Wallet verified");
          // companyStore.setCompany(company);
          // router.push("/v2/dashboard");
        },
        onError: (error: any) => {
          console.log(error, "error");
          toast.error(error?.response?.data || "Failed to verify wallet");
        },
      }
    );
  };

  return (
    <Card className="backdrop-blur-sm bg-white/80 relative">
      <div className="p-4">
        {!verificationMessage ? (
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">Verify Wallet</h1>
            <p className="text-sm mt-2 max-w-sm">
              We need to verify your wallet to provide you with access to our
              platform. Please click the button below to verify your wallet.
            </p>

            <Button
              onClick={requestVerfication}
              loading={submitRequestMutation.isPending}
              className="w-full mt-16"
            >
              Verify Wallet
            </Button>
          </div>
        ) : null}

        {verificationMessage ? (
          <div>
            <p className="max-w-md">
              To verify your wallet, we have generated a set of words. You will
              notice these words when you sign using your wallet. Once your
              signature is validated, your request will be submitted.
            </p>

            <div className="flex justify-center items-center py-8">
              <div className="text-xl font-semibold mx-2 p-2 border-2 border-slate-200 rounded">
                {verificationMessage.join(" ")}
              </div>
            </div>

            <Button
              loading={submitSignatureVerificationMutation.isPending}
              onClick={signAndVerfiy}
              className="mt-4 w-full"
            >
              Sign and verify wallet
            </Button>
          </div>
        ) : null}
      </div>
    </Card>
  );
};

export default VerifyWallet;
