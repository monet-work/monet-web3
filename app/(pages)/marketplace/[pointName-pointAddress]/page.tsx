"use client";

import TradeDetails from "@/components/trade-details";
import TradesView from "@/components/trades-view";
import { Skeleton } from "@/components/ui/skeleton";
import { pointsTableData } from "@/data";
import { AssetListing } from "@/models/asset-listing.model";
import { apiService } from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toTokens } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";

const PointPage = () => {
  const activeAccount = useActiveAccount();
  const walletAddress = activeAccount?.address;
  const pathname = usePathname();
  const pointNameWithAddress = pathname.split("/")[2];

  const pointName = pointNameWithAddress.split("-")[0];
  const pointAddress = pointNameWithAddress.split("-")[1];

  const [formattedAssetListings, setFormattedAssetListings] = useState<
    AssetListing[]
  >([]);

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
    if (!pointAssetInfoData?.data) return;
    const pointDecimals = pointAssetInfoData.data.decimals;

    const formattedListings =
      pointAssetInfoData.data.listings.assetListings.map((listing) => {
        return {
          ...listing,
          totalPrice: toTokens(BigInt(listing.totalPrice), 18),
          pricePerPoint: toTokens(BigInt(listing.pricePerPoint), 18),
        };
      });

    setFormattedAssetListings(formattedListings);
  }, [pointAssetInfoData]);

  const publicListings = formattedAssetListings.filter(
    (listing) => listing.owner !== walletAddress
  );

  const ownerListings = formattedAssetListings.filter(
    (listing) => listing.owner === walletAddress
  );

  return (
    <main className="pt-16">
      <div className="flex flex-col md:flex-row gap-4 w-full container">
        <div className="flex flex-col gap-4 flex-1">
          {isLoading ? (
            <Skeleton className="h-20 w-full" />
          ) : (
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl pb-2">
                  {pointAssetInfoData?.data.name}{" "}
                  <span className="text-muted-foreground">
                    ({pointAssetInfoData?.data.symbol})
                  </span>
                </h2>
                <Link
                  className="flex gap-2"
                  href={`https://sepolia.basescan.org/tx/${pointAddress}`}
                >
                  <p className="text-sm text-muted-foreground hover:underline">
                    {pointAddress}
                  </p>
                  <ExternalLinkIcon className="h-4 w-4 text-muted-foreground" />
                </Link>
              </div>

              <div className="text-muted-foreground text-2xl">
                <span className="font-bold mr-2">{pointAssetInfoData?.data.points}</span>
                <span className="font-light">{pointAssetInfoData?.data.symbol}</span>
              </div>
            </div>
          )}
          <div>
            <h3 className="mb-4">Public Listings</h3>
            <TradesView
              assetListings={publicListings || []}
              loading={isLoading}
            />
          </div>
          <div className="mt-8">
            <h3 className="mb-4">Your Listings</h3>
            <TradesView
              assetListings={ownerListings || []}
              loading={isLoading}
            />
          </div>
        </div>
        <div className="w-1/3">
          <TradeDetails isActive={true} Data={pointsTableData} />
        </div>
      </div>
    </main>
  );
};

export default PointPage;
