"use client";

import TradeDetails from "@/components/trade-details";
import TradesView from "@/components/trades-view";
import { pointsTableData } from "@/data";
import { apiService } from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const PointPage = () => {
  const router = useRouter();

  // get route params
  const pathname = usePathname();
  const pointNameWithAddress = pathname.split("/")[2];

  const pointName = pointNameWithAddress.split("-")[0];
  const pointAddress = pointNameWithAddress.split("-")[1];

  const {
    data: pointAssetInfoData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "marketplace/point-asset-info",
      {
        pointName,
        pointAddress,
      },
    ],
    queryFn: async () => {
      return await apiService.getMarketplacePointAssetInfo(pointAddress);
    },
    enabled: !!pointName && !!pointAddress,
  });

  useEffect(() => {
    console.log(pointAssetInfoData?.data, "pointAssetInfoData");
  }, [pointAssetInfoData]);

  return (
    <main className="pt-16">
      <div className="flex flex-col md:flex-row gap-4 w-full container">
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="mb-2">Public Trades</h3>
            <TradesView
              assetListings={
                pointAssetInfoData?.data.listings.assetListings || []
              }
              loading={isLoading}
            />
          </div>
          <div>
            <h3 className="mb-2">Your Trades</h3>
            <TradesView
              assetListings={
                pointAssetInfoData?.data.listings.ownerAndAssetListings || []
              }
              loading={isLoading}
            />
          </div>
        </div>
        <div className="border w-1/3">
          <TradeDetails isActive={true} Data={pointsTableData} />
        </div>
      </div>
    </main>
  );
};

export default PointPage;
