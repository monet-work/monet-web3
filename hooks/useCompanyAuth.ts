import { getCompanyByWalletAddress, getCustomer } from "@/lib/api-requests";
import { useCompanyStore } from "@/store/companyStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useActiveAccount } from "thirdweb/react";

const useCompanyAuth = () => {
  const account = useActiveAccount();
  const walletAddress = account?.address;
  const companyStore = useCompanyStore();

  const {
    data: companyData,
    isLoading,
    error,
    refetch: refetchCompanyData,
  } = useQuery({
    queryKey: ["company", walletAddress],
    queryFn: async () => {
      const data = await getCompanyByWalletAddress(walletAddress!);
      return data;
    },
    retry: 1,
    enabled: false,
  });

  useEffect(() => {
    if (!walletAddress) return;
    // fetch company data
    refetchCompanyData();
  }, [walletAddress]);

  useEffect(() => {
    const company = companyData?.data;
    if (company) {
      companyStore.setCompany(company);
    }
  }, [companyData, walletAddress]);

  useEffect(() => {
    if (!account) {
      // acts as a log out
      companyStore.setCompany(null);
    }
  }, [account]);
};

export default useCompanyAuth;
