"use client";

import { monetMarketplaceContract } from "@/app/contract-utils";
import PointsList from "@/components/points-list-component";
import { pointsTableData } from "@/data";
import { apiService } from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useReadContract } from "thirdweb/react";

const MarketplacePage = () => {
  const { data: PointsListData, isLoading } = useQuery({
    queryKey: [],
    queryFn: async () => {
      return await apiService.getMarketplacePointsList();
    },
  });
  console.log(PointsListData, "PointsListData");

  return (
    <main className="w-full flex gap-8 py-16 flex-col items-center">
      <div className="container">
        <h2 className="text-2xl pb-2">
          Live Points Market. Total Listings:{" "}
          {PointsListData?.data?.pointsAssets?.length}
        </h2>
        {!isLoading ? (
          <PointsList isLoading={false} Points={PointsListData?.data} />
        ) : (
          <div>Loading.....</div>
        )}
      </div>
    </main>
  );
};

export default MarketplacePage;
