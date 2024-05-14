"use client";

import CompanyRequestForm from "@/components/forms/company-request-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  submitCompanyRequest,
} from "@/lib/api-requests";
import { useCompanyStore } from "@/store/companyStore";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useActiveAccount } from "thirdweb/react";

const SubmitRequestPage = () => {
  const [randomWords, setRandomWords] = useState<string[] | undefined>(
    undefined
  );
  const [title, setTitle] = useState<string>("Submit Request");

  const activeAccount = useActiveAccount();
  const walletAddress = activeAccount?.address;
  const companyStore = useCompanyStore();
  const router = useRouter();

  const submitRequestMutation = useMutation({
    mutationFn: submitCompanyRequest,
  });

  // const submitSignatureVerificationMutation = useMutation({
  //   mutationFn: requestCompanyWalletVerfication,
  // });

  useEffect(() => {
    const company = companyStore.company;
    console.log(company, "company");
    if (company?.user?.isWalletApproved) {
      router.push("/v2/dashboard");
    }
  }, [companyStore.company]);

  const handleVerifyWallet = async () => {
    if (!randomWords) return;
    const walletSignature = await activeAccount?.signMessage({
      message: randomWords.join(" "),
    });
    if (!walletSignature) return;
    // submitSignatureVerificationMutation.mutate(
    //   {
    //     walletAddress: walletAddress!,
    //     message: randomWords.join(" "),
    //     signature: walletSignature,
    //   },
    //   {
    //     onSuccess: (response) => {
    //       companyStore.setCompany(response.data);
    //       toast.success("Wallet verified");
    //       router.push("/v2/dashboard");
    //     },
    //     onError: (error) => {
    //       toast.error(error.message || "Failed to verify wallet");
    //     },
    //   }
    // );
  };

  return (
    <>
      <main className="py-16 bg-black text-white min-h-screen">
        <section className="container pt-16">
          <Card className="max-w-md bg-slate-100 shadow-md mx-auto p-4">
            <h2 className="font-semibold mb-4">{title}</h2>

            {!randomWords && (
              <CompanyRequestForm
                loading={submitRequestMutation.isPending}
                onSubmitForm={(data) => {
                  if (!walletAddress) {
                    return toast.error("Wallet address not found");
                  }
                  submitRequestMutation.mutate(
                    {
                      walletAddress: walletAddress,
                    },
                    {
                      onSuccess: (response) => {
                        setRandomWords(response.data.message);
                        setTitle("Validate your walet");
                        console.log("response", randomWords);
                        toast.success("Request submitted");
                      },
                      onError: () => {
                        toast.error("Failed to submit request");
                      },
                    }
                  );
                }}
              />
            )}

            {randomWords && randomWords.length && (
              // create this into a separate component
              <div>
                <p className="max-w-md">
                  To verify your wallet, we have generated a set of words. You
                  will notice these words when you sign using your wallet. Once
                  your signature is validated, your request will be submitted.
                </p>

                <div className="flex justify-center items-center py-8">
                  <div className="text-xl font-semibold mx-2 p-2 border-2 border-slate-200 rounded">
                    {randomWords.join(" ")}
                  </div>
                </div>

                <Button
                  // loading={submitSignatureVerificationMutation.isPending}
                  onClick={handleVerifyWallet}
                  className="mt-4 w-full"
                >
                  Verfiy your wallet
                </Button>
              </div>
            )}
          </Card>
        </section>
      </main>
    </>
  );
};

export default SubmitRequestPage;
