"use client";
import {
  monetMarketplaceContract,
  monetPointsContractFactory,
} from "@/app/contract-utils";
import { DataTable } from "@/components/data-table/data-table";
import { AdminListingColumns } from "@/components/table-columns/admin-listing-columns";
import { CustomerColumns } from "@/components/table-columns/customers-columns";
import { useEffect, useState } from "react";
import { readContract } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";

export default function RewardPoints() {
  const account = useActiveAccount();
  const wallet = account?.address;
  const [rewardData, setRewardData] = useState<any[]>([]);

  // const RewardPointsFetch = async () => {
  //   if (!wallet) return;
  //   const data = await readContract({
  //     contract: monetPointsContractFactory(wallet),
  //     method: "getRewardPoints",
  //   });
  //   return data;
  // };

  return (
    <main className="bg-background">
      <div className="container">
        <div className="py-4">
          <div>
            <h2 className="mb-4 font-semibold text-slate-600p">Customers</h2>
            {/* <DataTable
              enablePagination={true}
              columns={AdminListingColumns}
              data={listingData}
              loading={isLoading}
            /> */}
          </div>
        </div>
      </div>
    </main>
  );
}
