"use client";

import CompanyDashboard from "@/components/company-dashboard";
import { getCompanyDashboardData } from "@/lib/api-requests";
import { Company } from "@/xata";
import { useQuery } from "@tanstack/react-query";
import { useActiveAccount } from "thirdweb/react";

const CompanyDashboardPage = () => {
  const activeAccount = useActiveAccount();
  const walletAddress = activeAccount?.address;
  const { data: dashboardDataResponse, isLoading } = useQuery({
    queryKey: ["companies/dashboard", { walletAddress: walletAddress }],
    queryFn: () => {
      return getCompanyDashboardData(walletAddress!);
    },
    enabled: !!walletAddress,
  });

  const parseContractInfo = (company?: Partial<Company>) => {
    if (!company || !company.pointContractAddress) {
      return undefined;
    }

    return {
      address: company.pointContractAddress,
      name: company.pointName,
      symbol: company.pointSymbol,
    };
  };

  return (
    <CompanyDashboard
      hasContract={!!dashboardDataResponse?.data?.company?.pointContractAddress}
      contract={parseContractInfo(dashboardDataResponse?.data?.company)}
      customerPoints={dashboardDataResponse?.data.customers || []}
    />
  );
};

export default CompanyDashboardPage;
