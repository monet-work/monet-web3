"use client";

import CompanyDashboard from "@/components/company-dashboard";
import useLocalStorage from "@/hooks/useLocalStorage";
import { LOCALSTORAGE_KEYS } from "@/models/tokens";
import { apiService } from "@/services/api.service";
import { useCompanyStore } from "@/store/companyStore";
import { useUserStore } from "@/store/userStore";
import { Company } from "@/xata";
import { useQuery } from "@tanstack/react-query";
import { useActiveAccount } from "thirdweb/react";

const CompanyDashboardPage = () => {
  const activeAccount = useActiveAccount();
  const companyStore = useCompanyStore();
  const userStore = useUserStore();
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
        companyStore.company?.id || userStore.user?.company.id || ""
      );
    },
    enabled: !!companyStore.company?.id || !!userStore.user?.company.id,
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
