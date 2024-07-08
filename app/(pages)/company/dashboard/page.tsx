"use client";

import CompanyDashboard from "@/components/company-dashboard";
import { apiService } from "@/services/api.service";
import { useCompanyStore } from "@/store/companyStore";
import { useUserStore } from "@/store/userStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const CompanyDashboardPage = () => {
  const companyStore = useCompanyStore();
  const userStore = useUserStore();
  const queryClient = useQueryClient();

  const [data, setData] = useState<any>([]);

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
        companyStore.company?.id || userStore.user?.company.id || "",
      );
    },
    enabled: !!companyStore.company?.id || !!userStore.user?.company.id,
  });

  useEffect(() => {
    if (dashboardDataResponse) {
      setData(dashboardDataResponse.data);
    }
  }, [dashboardDataResponse, companyStore.pointsDeleted]);
  const refetchListings = () => {
    // invalidate listings
    queryClient.invalidateQueries({
      queryKey: [
        `company-dashboard-${companyStore.company?.id}`,
        { companyId: companyStore.company?.id },
      ],
    });
  };

  useEffect(() => {
    if (companyStore.pointsDeleted) {
      refetchListings();
      companyStore.setPointsDeleted(false);
    }
  }, [companyStore.pointsDeleted]);

  return (
    <main>
      <CompanyDashboard
        company={data.company}
        dashboardData={data.dashboard || []}
        onUploadSuccess={() => refetch()}
      />
    </main>
  );
};

export default CompanyDashboardPage;
