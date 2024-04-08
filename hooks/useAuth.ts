import { elpContract } from "@/app/thirdweb";
import { getCustomer } from "@/lib/api-requests";
import { useCustomerStore } from "@/store/customerStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toTokens } from "thirdweb";
import { useActiveWallet, useReadContract } from "thirdweb/react";

const useAuth = () => {
  const wallet = useActiveWallet();
  const walletAddress = wallet?.getAccount()?.address;
  const customerStore = useCustomerStore();

  const { data: decimalsData, isLoading: isLoadingDecimals } = useReadContract({
    contract: elpContract,
    method: "decimals",
    params: [],
  });

  const { data: onChainBalanceData, isLoading: isLoadingOnChainPoints } =
    useReadContract({
      contract: elpContract,
      method: "balanceOf",
      params: [walletAddress!],
    });

  wallet?.subscribe("disconnect", () => {
    //not working at the moment
    console.log("disconnect event");
    customerStore.setCustomer(null);
  });

  const {
    data: customerData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["customer", walletAddress],
    queryFn: async () => {
      const data = await getCustomer({
        walletAddress: walletAddress || "",
      });
      return data;
    },
    retry: 1,
    enabled: false,
  });

  useEffect(() => {
    if (!walletAddress) return;
    refetch();
  }, [walletAddress]);

  useEffect(() => {
    if (customerData) {
      customerStore.setCustomer(customerData.data);
    }
  }, [customerData]);

  useEffect(() => {
    if (onChainBalanceData && decimalsData) {
      const points = toTokens(onChainBalanceData, decimalsData);
      customerStore.setOnChainPoints(points);
    }
  }, [onChainBalanceData, decimalsData]);
};

export default useAuth;
