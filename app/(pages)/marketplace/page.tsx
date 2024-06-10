"use client";

import { monetMarketplaceContract } from "@/app/contract-utils";
import { DataTable } from "@/components/data-table/data-table";
import { PointsListColumns } from "@/components/table-columns/points-list-columns";
import { pointsTableData } from "@/data";
import { apiService } from "@/services/api.service";
import { useMarketPlaceStore } from "@/store/marketPlaceStore";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useReadContract } from "thirdweb/react";

const MarketplacePage = () => {
  const router = useRouter();
  const { data: pointsListData, isLoading } = useQuery({
    queryKey: [],
    queryFn: async () => {
      return await apiService.getMarketplacePointsList();
    },
  });

  const marketPlaceStore = useMarketPlaceStore();

  useEffect(() => {
    marketPlaceStore.setMarketPlace(pointsListData?.data.pointsAssets || []);
  }, [pointsListData]);

  return (
    <main className="w-full flex gap-8 py-16 flex-col items-center min-h-screen">
      <div className="container">
        <h2 className="font-light pb-2">
          Live Points Market. Click on a point to start trading.
        </h2>

        <div className="mt-4">
          <DataTable
            columns={PointsListColumns}
            data={pointsListData?.data.pointsAssets || []}
            loading={isLoading}
            cursorPointer={true}
            enablePagination={true}
            onRowClick={(rowData) => {
              const pointName = rowData.name;
              const pointAddress = rowData.address;
              const urlEncodedPointName = encodeURIComponent(
                `${pointName}-${pointAddress}`
              );
              router.push(`/marketplace/${urlEncodedPointName}`);
            }}
          />
        </div>
      </div>
    </main>
  );
};

export default MarketplacePage;
