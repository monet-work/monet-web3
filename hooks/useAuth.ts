import { elpContract } from "@/app/thirdweb";
import { createCustomer, getCustomer } from "@/lib/api-requests";
import { useCustomerStore } from "@/store/customerStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toTokens } from "thirdweb";
import { useActiveAccount, useReadContract } from "thirdweb/react";

const useAuth = () => {
  const account = useActiveAccount();
  const walletAddress = account?.address;
  const customerStore = useCustomerStore();

  const createCustomerMutation = useMutation({
    mutationFn: createCustomer,
  });

  const { data: decimalsData, isLoading: isLoadingDecimals } = useReadContract({
    contract: elpContract,
    method: "decimals",
    params: [],
  });

  const { data: onChainBalanceData, isLoading: isLoadingOnChainPoints, refetch: refetchOnChainPoints } =
    useReadContract({
      contract: elpContract,
      method: "balanceOf",
      params: [walletAddress!],
    },);

  const {
    data: customerData,
    isLoading,
    error,
    refetch: refetchCustomerData,
  } = useQuery({
    queryKey: ["customer", walletAddress],
    queryFn: async () => {
      const data = await getCustomer({
        walletAddress: walletAddress!,
      });
      return data;
    },
    retry: 1,
    enabled: false,
  });

  useEffect(() => {
    if (!walletAddress) return;
    // fetch customer data
    refetchCustomerData();
    refetchOnChainPoints();
  }, [walletAddress]);

  useEffect(() => {
    const customer = customerData?.data;
    if (customer) {
      customerStore.setCustomer(customer);
    }
  }, [customerData, walletAddress]);

  useEffect(() => {
    const customer = customerData?.data;
    if (!walletAddress) return;

    if (!customer) {
      createCustomerMutation.mutate(
        {
          walletAddress: walletAddress!,
        },
        {
          onSuccess: (data) => {
            customerStore.setCustomer(data.data);
          },
          onError: (err) => {
            console.error(err, "Error while creating customer");
          },
        }
      );
    }
  }, [customerData, walletAddress]);

  useEffect(() => {
    if (!account) {
      // acts as a log out
      customerStore.setCustomer(null);
    }
  }, [account]);

  useEffect(() => {
    if (onChainBalanceData && decimalsData) {
      const points = toTokens(onChainBalanceData, decimalsData);
      customerStore.setOnChainPoints(points);
    }
  }, [onChainBalanceData, decimalsData]);
};

export default useAuth;
