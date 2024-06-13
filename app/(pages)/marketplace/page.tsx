"use client";

import {
  monetMarketplaceContract,
  monetPointsContractFactory,
} from "@/app/contract-utils";
import { DataTable } from "@/components/data-table/data-table";
import { PointsListColumns } from "@/components/table-columns/points-list-columns";
import { pointsTableData } from "@/data";
import { apiService } from "@/services/api.service";
import { useMarketPlaceStore } from "@/store/marketPlaceStore";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { readContract } from "thirdweb";
import { useReadContract } from "thirdweb/react";

const MarketplacePage = () => {
  const router = useRouter();
  const { data: pointsListData, isLoading } = useQuery({
    queryKey: [],
    queryFn: async () => {
      return await apiService.getMarketplacePointsList();
    },
  });
  const [blockchainData, setBlockchainData] = useState<
    {
      symbol: string;
      name: string;
      address: string;
      status: number;
    }[]
  >([]);

  const [listCount, setListCount] = useState(0);
  if (blockchainData.length === listCount) {
    console.log("blockchainData", blockchainData);
  }

  const marketPlaceStore = useMarketPlaceStore();

  const getMarketplaceDataFromContract = async () => {
    const allAddresses = await readContract({
      contract: monetMarketplaceContract,
      method: "getAssetAddresses",
      params: [],
    });
    setListCount(allAddresses.length);
    for (let i = 0; i < allAddresses.length; i++) {
      const Symbol = async () => {
        const Symboldata = await readContract({
          contract: monetPointsContractFactory(allAddresses[i]),
          method: "symbol",
        });
        return Symboldata;
      };
      const Name = async () => {
        const Namedata = await readContract({
          contract: monetPointsContractFactory(allAddresses[i]),
          method: "name",
        });
        return Namedata;
      };
      const AssetInfo = async () => {
        const Assetdata = await readContract({
          contract: monetMarketplaceContract,
          method: "getAsset",
          params: [allAddresses[i]],
        });
        return Assetdata;
      };
      const symbol = await Symbol();
      const name = await Name();
      const assetInfo = await AssetInfo();
      const status = assetInfo.status;
      const address = allAddresses[i];
      setBlockchainData((prev) => [
        ...prev,
        {
          symbol,
          name,
          address,
          status,
        },
      ]);
    }
  };

  useEffect(() => {
    marketPlaceStore.setMarketPlace(pointsListData?.data.pointsAssets || []);
  }, [pointsListData]);

  useEffect(() => {
    getMarketplaceDataFromContract();
  }, []);

  useEffect(() => {
    if (blockchainData.length === listCount) {
      marketPlaceStore.setMarketPlace(blockchainData);
    }
  }, [blockchainData]);

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
              blockchainData.length === listCount && listCount > 0
                ? blockchainData
                : pointsListData?.data.pointsAssets || []
            }
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
