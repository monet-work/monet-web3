"use client";

import { getCustomer } from "@/lib/api-requests";
import { useCustomerStore } from "@/store/customerStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useActiveWallet } from "thirdweb/react";
import { resolveMethod, toTokens } from "thirdweb";
import { useReadContract } from "thirdweb/react";
import { elpContract } from "@/app/thirdweb";

const Auth = () => {
  const wallet = useActiveWallet();
  const walletAddress = wallet?.getAccount()?.address;
  const customerStore = useCustomerStore();

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
    if (onChainBalanceData) {
      const points = toTokens(onChainBalanceData, 18);
      console.log("points on chain", points);
      customerStore.setOnChainPoints(points);
    }
  }, [onChainBalanceData]);

  return <></>;
};

export default Auth;
