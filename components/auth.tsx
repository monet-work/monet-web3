'use client';

import { getCustomer } from "@/lib/api-requests";
import { useCustomerStore } from "@/store/customerStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useActiveWallet } from "thirdweb/react";

const Auth = () => {
    const wallet = useActiveWallet();
    const walletAddress = wallet?.getAccount()?.address;
    const customerStore = useCustomerStore();
  
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
    return <></>
}

export default Auth;