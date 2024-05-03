"use client";

import { monetPointsFactoryContract } from "@/app/thirdweb";
import CompanyRequestForm from "@/components/forms/company-request-form";
import { Card } from "@/components/ui/card";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { PreparedTransaction, prepareContractCall, toWei } from "thirdweb";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";

const DashboardPage = () => {
  const userStore = useUserStore();
  const router = useRouter();
  const activeAccount = useActiveAccount();
  const companyWalletAddress = activeAccount?.address;

  useEffect(() => {
    if (!userStore.user?.isWalletApproved) {
      router.push("/v2");
    }
  }, [userStore.user]);

  const {
    mutate: sendCreatePointsTransaction,
    isPending,
    isError,
  } = useSendTransaction();

  const createPointsCall = async (
    owner: string,
    distributor: string,
    allTokens: bigint,
    decimalDigits: number,
    orderingFee: bigint,
    pointName: string,
    pointSymbol: string
  ) => {
    const transaction = await prepareContractCall({
      contract: monetPointsFactoryContract,
      method: "createPoint",
      params: [
        owner,
        distributor,
        allTokens,
        decimalDigits,
        orderingFee,
        pointName,
        pointSymbol,
      ],
    });

    await sendCreatePointsTransaction(transaction as PreparedTransaction, {
      onSuccess: () => {
        toast.message("Points Created", {
          description: "Your points have been created successfully",
        });
      },
      onError: () => {
        toast.message("Error while creating points", {
          description: "Please try again",
        });
      },
    });
  };

  return (
    <>
      <main className="min-h-screen bg-black text-white">
        <section className="container flex justify-center flex-col items-center">
          <h1 className="text-2xl">Welcome to Dashboard</h1>

          <Card className="p-4 mt-8 max-w-md w-2/3">
            <CompanyRequestForm
              loading={isPending}
              onSubmitForm={(values) => {
                const {
                  tokens,
                  decimalDigits,
                  orderingFee,
                  pointName,
                  pointSymbol,
                } = values;

                if (!companyWalletAddress) return;

                createPointsCall(
                  companyWalletAddress,
                  "0x73029Df592EC27FeDddE45a512B4c42ad35A3e7d",
                  toWei(tokens),
                  Number(decimalDigits),
                  toWei(orderingFee),
                  pointName,
                  pointSymbol
                );
              }}
            />
          </Card>
        </section>
      </main>
    </>
  );
};

export default DashboardPage;
