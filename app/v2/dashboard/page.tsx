"use client";

import CompanyRequestForm from "@/components/forms/company-request-form";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import PointContractInfo from "@/components/v2/point-contract-info";
import {
  createCompanyContract,
  getCompanyByWalletAddress,
} from "@/lib/api-requests";
import { useCompanyStore } from "@/store/companyStore";
import { useUserStore } from "@/store/userStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useActiveAccount } from "thirdweb/react";

const DashboardPage = () => {
  const userStore = useUserStore();
  const companyStore = useCompanyStore();
  const router = useRouter();
  const activeAccount = useActiveAccount();
  const companyWalletAddress = activeAccount?.address;
  const [showForm, setShowForm] = useState(false);

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
    if (companyData?.data) {
      companyStore.setCompany(companyData.data);
    }
    if (isCompanyError) {
      router.push("/v2");
    }
  }, [companyData, companyStore.company]);

  const currentCompany = companyStore?.company;

  useEffect(() => {
    if (currentCompany && currentCompany.pointContractAddress) {
      console.log(currentCompany, "current company");
      setShowForm(false);
    } else {
      setShowForm(true);
    }
  }, [currentCompany]);

  return (
    <>
      <main className="min-h-screen bg-black text-white py-4">
        <section className="container">
          <h1 className="text-lg text-slate-300">Dashboard</h1>

          {isCompanyLoading ? (
            <div className="flex justify-center items-center h-[400px]">
              <Spinner size={"large"} className="text-white" />
            </div>
          ) : null}

          {currentCompany && !isCompanyLoading && !showForm ? (
            <div className="mt-4">
              <PointContractInfo
                address={currentCompany.pointContractAddress || ""}
                name={currentCompany.pointName || ""}
                symbol={currentCompany.pointSymbol || ""}
              />
            </div>
          ) : null}

          {currentCompany && showForm && !isCompanyLoading ? (
           <div className="">
             <Card className="p-4 mt-8 max-w-md w-2/3 mx-auto">
              <h3>Deploy your points contract</h3>
              <CompanyRequestForm
                loading={createCompanyContractMutation.isPending}
                onSubmitForm={(values) => {
                  const {
                    email,
                    name,
                    points,
                    decimalDigits,
                    orderingFee,
                    pointName,
                    pointSymbol,
                  } = values;

                  createCompanyContractMutation.mutate(
                    {
                      companyName: name,
                      email,
                      allPoints: points,
                      decimalDigits,
                      orderingFee: orderingFee,
                      pointsName: pointName,
                      pointsSymbol: pointSymbol,
                      walletAddress: companyWalletAddress!,
                    },
                    {
                      onSuccess: (response) => {
                        toast.success("Points contract created successfully");
                        companyStore.setCompany(response.data);
                        setShowForm(false);
                        window.location.reload();
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
           </div>
          ) : null}
        </section>
      </main>
    </>
  );
};

export default DashboardPage;
