"use client";
import {
  monetMarketplaceContract,
  monetPointsContractFactory,
  rewardPointsFactoryAddress,
} from "@/app/contract-utils";
import { DataTable } from "@/components/data-table/data-table";
import { AdminListingColumns } from "@/components/table-columns/admin-listing-columns";
import { AdminRewardPointColumns } from "@/components/table-columns/admin-reward-points-columns";
import { CustomerColumns } from "@/components/table-columns/customers-columns";
import { PointsListColumns } from "@/components/table-columns/points-list-columns";
import { useRewardPointsStore } from "@/store/rewardPointsStore";
import { useEffect, useState } from "react";
import {
  getContractEvents,
  prepareEvent,
  readContract,
  toTokens,
} from "thirdweb";
import { useActiveAccount, useReadContract } from "thirdweb/react";

export default function RewardPoints() {
  const account = useActiveAccount();
  const wallet = account?.address;

  const [rewardPointsData, setRewardPointsData] = useState<
    {
      symbol: string;
      name: string;
      address: string;
      status: number;
      mintedPoints?: number;
    }[]
  >([]);

  console.log(rewardPointsData, "rewardPointsData");

  const { data, isLoading } = useReadContract({
    contract: monetMarketplaceContract,
    method: "getAssetAddresses",
    params: [],
  });
  // console.log(data, "data");

  const { rewardPoints, setRewardPoints } = useRewardPointsStore();

  const FetchRewardPoints = async () => {
    if (isLoading) return;
    if (!data) return;
    const mint = prepareEvent({
      signature: "event Mint(address,uint256)",
    });
    for (let i = 0; i < data.length; i++) {
      const events = await getContractEvents({
        contract: monetPointsContractFactory(data[i].toString()),
        fromBlock: "earliest",
        toBlock: "latest",
        events: [mint],
      });
      const decimals = await readContract({
        contract: monetPointsContractFactory(data[i]),
        method: "decimals",
      });
      const Symbol = async () => {
        const Symboldata = await readContract({
          contract: monetPointsContractFactory(data[i]),
          method: "symbol",
        });
        return Symboldata;
      };
      const Name = async () => {
        const Namedata = await readContract({
          contract: monetPointsContractFactory(data[i]),
          method: "name",
        });
        return Namedata;
      };
      const AssetInfo = async () => {
        const Assetdata = await readContract({
          contract: monetMarketplaceContract,
          method: "getAsset",
          params: [data[i]],
        });
        return Assetdata;
      };
      const mintedPointsCalculation = async () => {
        let mintedPoints = 0;
        events.forEach((event) => {
          mintedPoints += Number(toTokens(BigInt(event.args[1]), decimals));
        });
        return mintedPoints;
      };

      const asset = await AssetInfo();
      const symbol = await Symbol();
      const name = await Name();
      const mintedPoints = await mintedPointsCalculation();

      setRewardPointsData((prev) => [
        ...prev,
        {
          symbol: symbol,
          name: name,
          address: asset.asset,
          status: asset.status,
          mintedPoints: mintedPoints,
        },
      ]);
    }
  };

  useEffect(() => {
    if (data) {
      FetchRewardPoints();
    }
  }, [wallet, isLoading]);

  useEffect(() => {
    if (isLoading) return;
    if (!data) return;
    if (rewardPointsData.length === data.length) {
      setRewardPoints(rewardPointsData);
    }
  }, [rewardPointsData, setRewardPoints, isLoading]);

  return (
    <main className="bg-background">
      <div className="container">
        <div className="py-4">
          <div>
            <h2 className="mb-4 font-semibold text-slate-600p">Customers</h2>
            <DataTable
              columns={AdminRewardPointColumns}
              data={rewardPoints ? rewardPoints : rewardPointsData || []}
              loading={isLoading}
              enablePagination={true}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
