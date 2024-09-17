"use client";

import { DataTable } from "@/components/data-table/data-table";
import { PointsListColumns } from "@/components/table-columns/points-list-columns";
import { fetchMarketplaceDataFromBlockchain } from "@/lib/blockchain-data-helper";
import { apiService } from "@/services/api.service";
import { useMarketPlaceStore } from "@/store/marketPlaceStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useActiveAccount } from "thirdweb/react";

const MarketplacePage = () => {
  const router = useRouter();
  const activeAccount = useActiveAccount();
  const queryClient = useQueryClient();

  const { data: pointsListData, isLoading } = useQuery({
    queryKey: ["pointsListData"],
    queryFn: async () => {
      return await apiService.getMarketplacePointsList();
    },
  });

  const useFetchMarketplaceDataFromBlockchain = () => {
    return useQuery({
      queryKey: ["marketplaceData"],
      queryFn: async () => {
        return await fetchMarketplaceDataFromBlockchain(
          activeAccount?.address!,
        );
      },
      enabled: !!activeAccount?.address,
      staleTime: 0,
    });
  };

  const {
    data: marketplaceDataFromBlockchain,
    isLoading: isLoadingMarketplaceData,
  } = useFetchMarketplaceDataFromBlockchain();

  const marketPlaceStore = useMarketPlaceStore();

  const invalidatePointsListData = () => {
    queryClient.invalidateQueries({
      queryKey: ["pointsListData"],
    });
  };

  const invalidateMarketplaceData = () => {
    queryClient.invalidateQueries({
      queryKey: ["marketplaceData"],
    });
  };

  const refetchMarketplaceData = () => {
    invalidatePointsListData();
    invalidateMarketplaceData();
  };

  useEffect(() => {
    if (marketPlaceStore.offerCreated) {
      refetchMarketplaceData();
      marketPlaceStore.setOfferCreated(false);
    }
  }, [marketPlaceStore.offerCreated]);

  useEffect(() => {
    if (marketplaceDataFromBlockchain?.length === 0) {
      marketPlaceStore.setMarketPlace(pointsListData?.data.pointsAssets);
    }
  }, [pointsListData]);

  useEffect(() => {
    if (!marketplaceDataFromBlockchain) return;
    if (marketplaceDataFromBlockchain.length > 0) {
      marketPlaceStore.setMarketPlace(marketplaceDataFromBlockchain);
    }
  }, [marketplaceDataFromBlockchain]);

  return (
    <main className="w-full flex gap-8 py-16 flex-col items-center min-h-screen">
      <div className="container">
        <h2 className="font-light pb-2">
          Live Points Market. Click on a point to start trading.
        </h2>

        <div className="mt-4">
          <DataTable
            columns={PointsListColumns}
            data={
              marketplaceDataFromBlockchain &&
              marketplaceDataFromBlockchain.length > 0
                ? marketplaceDataFromBlockchain
                : pointsListData?.data.pointsAssets || []
            }
            loading={isLoading}
            cursorPointer={true}
            enablePagination={true}
            onRowClick={(rowData) => {
              const pointName = rowData.name;
              const pointAddress = rowData.address;
              const urlEncodedPointName = encodeURIComponent(
                `${pointName}-${pointAddress}`,
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
