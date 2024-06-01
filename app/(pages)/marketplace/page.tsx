'use client';

import { monetMarketplaceContract } from "@/app/contract-utils";
import PointsList from "@/components/points-list-component";
import { pointsTableData } from "@/data";
import { useEffect } from "react";
import { useReadContract } from "thirdweb/react";

const MarketplacePage = () => {
  const { data: listingCountData, isLoading } = useReadContract({
    contract: monetMarketplaceContract,
    method: "getListingCount",
    params: []
  });

  useEffect(() => {
    console.log(listingCountData, 'listingCountData')
  }, [listingCountData])

  return (
    <main className="w-full flex gap-8 py-16 flex-col items-center">
      <div className="container">
        <h2 className="text-2xl pb-2">Live Points Market. Total Listings: {String(listingCountData)}</h2>
        <PointsList isLoading={false} Points={pointsTableData} />
      </div>
    </main>
  );
};

export default MarketplacePage;
