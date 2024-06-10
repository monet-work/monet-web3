"use client";
import {
  monetMarketplaceContract,
  monetPointsContractFactory,
  rewardPointsFactoryAddress,
} from "@/app/contract-utils";
import { DataTable } from "@/components/data-table/data-table";
import { AdminListingColumns } from "@/components/table-columns/admin-listing-columns";
import { CustomerColumns } from "@/components/table-columns/customers-columns";
import { PointsListColumns } from "@/components/table-columns/points-list-columns";
import { useEffect, useState } from "react";
import { readContract } from "thirdweb";
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
    }[]
  >([
    {
      symbol: "",
      name: "",
      address: "",
      status: 0,
    },
  ]);

  // console.log(rewardPointsData, "rewardPointsData");

  const { data, isLoading } = useReadContract({
    contract: rewardPointsFactoryAddress,
    method: "getRewardPoints",
    params: [],
  });
  // console.log(data, "data");

  const FetchRewardPoints = async () => {
    if (isLoading) return;
    if (!data) return;
    for (let i = 0; i < data.length; i++) {
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

      const asset = await AssetInfo();
      const symbol = await Symbol();
      const name = await Name();
      console.log({
        symbol,
        name,
        address: asset.asset,
        status: asset.status,
        index: data[i],
      });
      setRewardPointsData((prev) => [
        ...prev,
        {
          symbol: symbol,
          name: name,
          address: asset.asset,
          status: asset.status,
        },
      ]);
    }
  };

  useEffect(() => {
    if (data) {
      FetchRewardPoints();
    }
  }, [wallet, isLoading]);

  return (
    <main className="bg-background">
      <div className="container">
        <div className="py-4">
          <div>
            <h2 className="mb-4 font-semibold text-slate-600p">Customers</h2>
            <DataTable
              columns={PointsListColumns}
              data={rewardPointsData || []}
              loading={isLoading}
              enablePagination={true}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
