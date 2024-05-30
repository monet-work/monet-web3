"use client";

import CompanyDashboard from "@/components/company-dashboard";
import useLocalStorage from "@/hooks/useLocalStorage";
import { getCompanyDashboardData } from "@/lib/api-requests";
import { LOCALSTORAGE_KEYS } from "@/models/tokens";
import { apiService } from "@/services/api.service";
import { useCompanyStore } from "@/store/companyStore";
import { Company } from "@/xata";
import { useQuery } from "@tanstack/react-query";
import { useActiveAccount } from "thirdweb/react";

const CompanyDashboardPage = () => {
  const activeAccount = useActiveAccount();
  const companyStore = useCompanyStore();
  const walletAddress = activeAccount?.address;
  const [refreshToken, setRefreshToken] = useLocalStorage(
    LOCALSTORAGE_KEYS.REFRESH_TOKEN,
    ""
  );

  const { data: dashboardDataResponse, isLoading } = useQuery({
    queryKey: [
      `company-dashboard-${companyStore.company?.id}`,
      { companyId: companyStore.company?.id },
    ],
    queryFn: () => {
      return apiService.fetchCompanyDashboard(
        companyStore.company?.id!,
      );
    },
    enabled: !!companyStore.company?.id && !!refreshToken.token,
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
      customerPoints={[]}
    />
  );
};

export default CompanyDashboardPage;
