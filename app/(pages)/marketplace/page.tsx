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
import {
  Address,
  getContractEvents,
  prepareEvent,
  readContract,
  toTokens,
} from "thirdweb";
import {
  useActiveAccount,
  useContractEvents,
  useReadContract,
} from "thirdweb/react";

const MarketplacePage = () => {
  const router = useRouter();
  const activeAccount = useActiveAccount();
  const userAddress = activeAccount?.address;

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
      mintedPoints?: number;
      userPoints?: number;
    }[]
  >([]);

  const [listCount, setListCount] = useState(0);

  const marketPlaceStore = useMarketPlaceStore();

  const getMarketplaceDataFromContract = async () => {
    const mint = prepareEvent({
      signature: "event Mint(address,uint256)",
    });
    const allPointContractAddresses = await readContract({
      contract: monetMarketplaceContract,
      method: "getAssetAddresses",
      params: [],
    });

    setListCount(allPointContractAddresses.length);
    for (let i = 0; i < allPointContractAddresses.length; i++) {
      if (!allPointContractAddresses[i]) return;
      // console.log(allPointContractAddresses[i], "allPointContractAddresses[i]");
      const events = await getContractEvents({
        contract: monetPointsContractFactory(
          allPointContractAddresses[i].toString(),
        ),
        fromBlock: "earliest",
        toBlock: "latest",
        events: [mint],
      });
      // console.log(events, "events inside loop");
      const decimals = await readContract({
        contract: monetPointsContractFactory(allPointContractAddresses[i]),
        method: "decimals",
      });
      const Symbol = async () => {
        const Symboldata = await readContract({
          contract: monetPointsContractFactory(allPointContractAddresses[i]),
          method: "symbol",
        });
        return Symboldata;
      };
      const Name = async () => {
        const Namedata = await readContract({
          contract: monetPointsContractFactory(allPointContractAddresses[i]),
          method: "name",
        });
        return Namedata;
      };
      const AssetInfo = async () => {
        const Assetdata = await readContract({
          contract: monetMarketplaceContract,
          method: "getAsset",
          params: [allPointContractAddresses[i]],
        });
        return Assetdata;
      };

      const onChainPointsCalculations = async () => {
        let onChainPoints = 0;
        // array of user minted events
        const userEvents = events.filter(
          (item) => item.args[0] === userAddress,
        );
        userEvents.forEach((event) => {
          onChainPoints += Number(toTokens(BigInt(event.args[1]), decimals));
        });
        return onChainPoints;
      };

      const userOnChainPoints = async () => {
        if (!activeAccount?.address) return;

        const userPoints = await readContract({
          contract: monetPointsContractFactory(allPointContractAddresses[i]),
          method: "balanceOf",
          params: [activeAccount?.address],
        });
        // console.log(userPoints, "userPoints");
        return Number(toTokens(userPoints, decimals));
      };
      const symbol = await Symbol();
      const name = await Name();
      const assetInfo = await AssetInfo();
      const status = assetInfo.status;
      const address = allPointContractAddresses[i];
      const onChainPoints = await onChainPointsCalculations();
      const userPoints = await userOnChainPoints();
      setBlockchainData((prev) => [
        ...prev,
        {
          symbol,
          name,
          address,
          status,
          mintedPoints: onChainPoints,
          userPoints: userPoints && userPoints > 0 ? userPoints : 0,
        },
      ]);
    }
  };

  useEffect(() => {
    if (blockchainData.length === 0) {
      marketPlaceStore.setMarketPlace(pointsListData?.data.pointsAssets);
    }
  }, [pointsListData]);

  useEffect(() => {
    if (activeAccount?.address) {
      getMarketplaceDataFromContract();
    }
  }, [activeAccount?.address]);

  useEffect(() => {
    if (blockchainData.length === listCount && listCount > 0) {
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
