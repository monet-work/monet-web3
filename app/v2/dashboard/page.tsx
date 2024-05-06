"use client";

import { monetPointsFactoryContract } from "@/app/thirdweb";
import CompanyRequestForm from "@/components/forms/company-request-form";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import {
  createCompanyContract,
  getCompanyByWalletAddress,
} from "@/lib/api-requests";
import { useCompanyStore } from "@/store/companyStore";
import { useUserStore } from "@/store/userStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { useActiveAccount } from "thirdweb/react";

const DashboardPage = () => {
  const userStore = useUserStore();
  const companyStore = useCompanyStore();
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

  const {
    data: companyData,
    isLoading: isCompanyLoading,
    isError: isCompanyError,
  } = useQuery({
    queryKey: ["company", { walletAddress: companyWalletAddress }],
    queryFn: () => {
      return getCompanyByWalletAddress(companyWalletAddress!);
    },
  });

  useEffect(() => {
    if (companyData) {
      companyStore.setCompany(companyData.data);
    }
    if (isCompanyError) {
      router.push("/v2");
    }
  }, [companyData, isCompanyLoading, isCompanyError]);

  return (
    <>
      <main className="min-h-screen bg-black text-white">
        <section className="container flex justify-center flex-col items-center">
          <h1 className="text-2xl">Welcome to Dashboard</h1>

          {isCompanyLoading ? (
            <div className="flex justify-center items-center h-[400px]">
              <Spinner size={"large"} className="text-white" />
            </div>
          ) : null}

          {companyStore.company &&
          companyStore.company.pointsContractCreated ? (
            <div>Your company contract has been created successfully</div>
          ) : null}

          {companyStore.company &&
          !companyStore.company.pointsContractCreated ? (
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
          ) : null}
        </section>
      </main>
    </>
  );
};

export default DashboardPage;
