import { getCompanyByWalletAddress } from "@/lib/api-requests";
import { useCompanyStore } from "@/store/companyStore";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useActiveAccount } from "thirdweb/react";
import useLocalStorage from "./useLocalStorage";

const useCompanyAuth = () => {
  const account = useActiveAccount();
  const walletAddress = account?.address;
  const companyStore = useCompanyStore();
  const router = useRouter();
  const [accessToken, setAccessToken] = useLocalStorage<string | undefined>(
    "accessToken",
    undefined
  );

  useEffect(() => {
    if (!accessToken) {
      router.push("/v2");
    }
  }, [accessToken]);

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
