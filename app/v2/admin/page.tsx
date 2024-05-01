"use client";

import CompanyList from "@/components/company-list";
import { getCompanies } from "@/lib/api-requests";
import { useQuery } from "@tanstack/react-query";
import { useActiveAccount } from "thirdweb/react";

const AdminPage = () => {
  const activeAccount = useActiveAccount();
  const walletAddress = activeAccount?.address;

  const {
    data: companiesData,
    isLoading,
    error,
    refetch: refetchCompaniesData,
  } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const data = await getCompanies();
      return data;
    },
  });

  return (
    <main className="py-16">
      <div className="container">
        <CompanyList
          companies={companiesData?.data || []}
          loading={isLoading}
        />
      </div>
    </main>
  );
};

export default AdminPage;
