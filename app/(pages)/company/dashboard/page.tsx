"use client";

import CompanyDashboard from "@/components/company-dashboard";
import { apiService } from "@/services/api.service";
import { useCompanyStore } from "@/store/companyStore";
import { useUserStore } from "@/store/userStore";
import { useQuery } from "@tanstack/react-query";

const CompanyDashboardPage = () => {
  const companyStore = useCompanyStore();
  const userStore = useUserStore();

  const {
    data: dashboardDataResponse,
    isLoading,
    refetch,
  } = useQuery({
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

  return (
    <main>
      {isLoading || !dashboardDataResponse?.data.company ? (
        "Loading..."
      ) : (
        <CompanyDashboard
          company={dashboardDataResponse?.data.company}
          dashboardData={dashboardDataResponse?.data.dashboard}
          onUploadSuccess={() => refetch()}
        />
      )}
    </main>
  );
};

export default CompanyDashboardPage;
