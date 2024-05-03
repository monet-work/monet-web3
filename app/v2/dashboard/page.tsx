"use client";

import { monetPointsFactoryContract } from "@/app/thirdweb";
import CompanyRequestForm from "@/components/forms/company-request-form";
import { Card } from "@/components/ui/card";
import { createCompanyContract } from "@/lib/api-requests";
import { useUserStore } from "@/store/userStore";
import { useMutation } from "@tanstack/react-query";
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

  const createCompanyContractMutation = useMutation({
    mutationFn: createCompanyContract,
  });

  return (
    <>
      <main className="min-h-screen bg-black text-white">
        <section className="container flex justify-center flex-col items-center">
          <h1 className="text-2xl">Welcome to Dashboard</h1>

          <Card className="p-4 mt-8 max-w-md w-2/3">
            <CompanyRequestForm
              loading={createCompanyContractMutation.isPending}
              onSubmitForm={(values) => {
                const {
                  email,
                  name,
                  tokens,
                  decimalDigits,
                  orderingFee,
                  pointName,
                  pointSymbol,
                } = values;

                createCompanyContractMutation.mutate(
                  {
                    companyName: name,
                    email,
                    allPoints: tokens,
                    decimalDigits,
                    orderingFee: orderingFee,
                    pointsName: pointName,
                    pointsSymbol: pointSymbol,
                    walletAddress: companyWalletAddress!,
                  },
                  {
                    onSuccess: (response) => {
                      toast.success(response.data);
                    },
                    onError: (error: any) => {
                      toast.error(
                        error?.response?.data ||
                          "Failed to create points contract"
                      );
                    },
                  }
                );

                if (!companyWalletAddress) return;
              }}
            />
          </Card>
        </section>
      </main>
    </>
  );
};

export default DashboardPage;
