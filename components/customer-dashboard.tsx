"use client";

import { getCustomerPoints } from "@/lib/api-requests";
import { useQuery } from "@tanstack/react-query";
import { useActiveAccount } from "thirdweb/react";

const CustomerDashboard = () => {
  const activeAccount = useActiveAccount();
  const walletAddress = activeAccount?.address;
  const {
    data: customerPointsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["customers/points", { walletAddress: walletAddress }],
    queryFn: () => {
      return getCustomerPoints(walletAddress!);
    },
    enabled: !!walletAddress,
  });

  console.log(customerPointsResponse?.data, "points response");

  return (
    <div>
      <div className="container">Customer Dashboard</div>
    </div>
  );
};

export default CustomerDashboard;
