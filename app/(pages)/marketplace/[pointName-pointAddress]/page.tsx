"use client";

import {
  monetMarketplaceContract,
  monetPointsContractFactory,
} from "@/app/contract-utils";
import OverlayMessageBox from "@/components/overlay-message-box";
import TradeDetails from "@/components/trade-details";
import TradesView from "@/components/trades-view";
import { Skeleton } from "@/components/ui/skeleton";
import UserTradeView from "@/components/user-trade-view";
import { pointsTableData } from "@/data";
import {
  AssetListing,
  AssetStatus,
  ListingStatus,
} from "@/models/asset-listing.model";
import { apiService } from "@/services/api.service";
import { useMarketPlaceStore } from "@/store/marketPlaceStore";
import { useQuery } from "@tanstack/react-query";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Address, readContract, toTokens } from "thirdweb";
import { useActiveAccount, useReadContract } from "thirdweb/react";

const PointPage = () => {
  const activeAccount = useActiveAccount();
  const walletAddress = activeAccount?.address;
  const pathname = usePathname();
  const pointNameWithAddress = pathname.split("/")[2];
  const [isBlockchainLoading, setIsBlockchainLoading] =
    useState<boolean>(false);
  const [listingData, setListingData] = useState<any[]>([]);
  const [decimals, setDecimals] = useState<number>(0);
  const [assetStatus, setAssetStatus] = useState<AssetStatus>(AssetStatus.LIVE);
  const [redeemCompletionOverlay, setRedeemCompletionOverlay] = useState({
    shouldShowTradeCompletionOverlay: false,
    children: <></>,
  });
  const [formattedBlockchainListings, setFormattedBlockchainListings] =
    useState<AssetListing[]>([]);
  const pointName = pointNameWithAddress.split("-")[0];
  const pointAddress = pointNameWithAddress.split("-")[1];
  const [selectedListing, setSelectedListing] = useState<
    AssetListing | undefined
  >(undefined);
  const marketplaceStore = useMarketPlaceStore();

  const handleTradeCompletionDialogCallback = (
    showTradeCompletion: boolean,
    children: JSX.Element,
  ) => {
    setRedeemCompletionOverlay({
      ...redeemCompletionOverlay,
      shouldShowTradeCompletionOverlay: showTradeCompletion,
      children: children,
    });
  };

  const { data: decimalsData, isLoading: isLoadingDecimalsData } =
    useReadContract({
      contract: monetPointsContractFactory(pointAddress),
      method: "decimals",
    });

  const {
    data: listingCountData,
    isLoading: isLoadingListingCountData,
    refetch: refetchListingCountData,
  } = useReadContract({
    contract: monetMarketplaceContract,
    method: "getListingCount",
    queryOptions: {
      enabled: !!activeAccount?.address,
    },
  });

  const fetchListings = async () => {
    setIsBlockchainLoading(true);
    if (!listingCountData) return;
    for (let i = 1; i <= Number(listingCountData); i++) {
      const Listings = async () => {
        const data = await readContract({
          contract: monetMarketplaceContract,
          method: "getListing",
          params: [BigInt(i)],
        });

        if (data.asset === pointAddress) {
          setListingData((prev: any) => [...prev, data]);
        }
      };

      await Listings();
    }

    setIsBlockchainLoading(false);
  };

  useEffect(() => {
    if (!decimalsData) return;
    const formattedListings = listingData.map((listing) => {
      const _amount = BigInt(listing.amount);
      const pricePerPoint = BigInt(listing.pricePerPoint);
      return {
        ...listing,
        Id: Number(listing.Id),
        amount: toTokens(BigInt(listing.amount), decimalsData),
        totalPrice: toTokens(_amount * pricePerPoint, 18),
        pricePerPoint: toTokens(BigInt(listing.pricePerPoint), 18),
      };
    });
    setFormattedBlockchainListings(formattedListings);
  }, [isBlockchainLoading]);

  useEffect(() => {
    if (Number(listingCountData) != 0) {
      fetchListings();
    }
  }, [listingCountData]);

  useEffect(() => {
    if (marketplaceStore.listingCancelled) {
      refetchPointAssetInfoData();
      fetchListings();
      marketplaceStore.setListingCancelled(false);
    }
  }, [marketplaceStore.listingCancelled]);

  const [formattedAssetListings, setFormattedAssetListings] = useState<
    AssetListing[]
  >([]);

  const getAssetStatus = async () => {
    const assetStatus = await readContract({
      contract: monetMarketplaceContract,
      method: "getAsset",
      params: [pointAddress as Address],
    });
    setAssetStatus(Number(assetStatus.status));
  };

  useEffect(() => {
    getAssetStatus();
  }, []);

  const {
    data: pointAssetInfoData,
    isLoading: isLoadingPointAssetInfoData,
    isError,
    refetch: refetchPointAssetInfoData,
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
          amount: toTokens(BigInt(listing.amount), pointDecimals),
          pricePerPoint: toTokens(BigInt(listing.pricePerPoint), 18),
        };
      });

    setFormattedAssetListings(formattedListings);
  }, [pointAssetInfoData]);

  const publicListings =
    formattedBlockchainListings.length > 0
      ? formattedBlockchainListings.filter(
          (listing) => listing.owner !== walletAddress,
        )
      : formattedAssetListings.filter(
          (listing) => listing.owner !== walletAddress,
        );

  const livePublicListings = publicListings.filter(
    (listing) => listing.status === ListingStatus.LIVE,
  );

  const completedPublicListings = publicListings.filter(
    (listing) => listing.status === ListingStatus.BOUGHT,
  );

  const ownerListings =
    formattedBlockchainListings.length > 0
      ? formattedBlockchainListings.filter(
          (listing) => listing.owner === walletAddress,
        )
      : formattedAssetListings.filter(
          (listing) => listing.owner === walletAddress,
        );

  return (
    <main className="pt-16">
      <div className="flex flex-col md:flex-row gap-8 w-full container">
        <div className="flex flex-col gap-4 flex-1">
          {isLoadingPointAssetInfoData ? (
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
                  href={`https://sepolia.basescan.org/address/${pointAddress}`}
                >
                  <p className="text-sm text-muted-foreground hover:underline">
                    {pointAddress}
                  </p>
                  <ExternalLinkIcon className="h-4 w-4 text-muted-foreground" />
                </Link>
              </div>

              <div className="text-muted-foreground text-2xl">
                <span className="font-bold mr-2">
                  {pointAssetInfoData?.data.points}
                </span>
                <span className="font-light">
                  {pointAssetInfoData?.data.symbol}
                </span>
              </div>
            </div>
          )}
          <div>
            <h3 className="mb-4">Live public listings</h3>
            <TradesView
              assetListings={livePublicListings || []}
              loading={isLoadingPointAssetInfoData}
              onListingSelected={(listing) => setSelectedListing(listing)}
            />
          </div>
          <div className="mt-8">
            <h3 className="mb-4 text-muted-foreground">
              Recently completed listings
            </h3>
            <TradesView
              assetListings={completedPublicListings || []}
              loading={isLoadingPointAssetInfoData}
            />
          </div>
          <div className="mt-8">
            <h3 className="mb-4 text-muted-foreground">Your listings</h3>
            <UserTradeView
              assetListings={ownerListings || []}
              loading={isLoadingPointAssetInfoData}
            />
          </div>
        </div>
        <div className="w-full md:w-1/3 relative">
          <div className="sticky top-[100px] mt-8">
            <TradeDetails
              pointInfo={{
                name: pointAssetInfoData?.data.name || "",
                symbol: pointAssetInfoData?.data.symbol || "",
                assetStatus: assetStatus,
              }}
              assetListing={selectedListing}
              decimals={decimalsData || 0}
              onTradeSuccess={(show: boolean, children: JSX.Element) => {
                setSelectedListing(undefined);
                handleTradeCompletionDialogCallback(show, children);
                refetchPointAssetInfoData();
                fetchListings();
              }}
            />
          </div>
        </div>
      </div>
      {redeemCompletionOverlay.shouldShowTradeCompletionOverlay && (
        <OverlayMessageBox
          showCloseButton={true}
          onClose={() =>
            setRedeemCompletionOverlay({
              ...redeemCompletionOverlay,
              shouldShowTradeCompletionOverlay: false,
            })
          }
          closeOnBackdropClick={false}
          closeOnEscapeKey={true}
        >
          {redeemCompletionOverlay.children}
        </OverlayMessageBox>
      )}
    </main>
  );
};

export default PointPage;
