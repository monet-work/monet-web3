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
import useHasMounted from "@/hooks/useHasMounted";
import { fetchListingsFromBlockchain } from "@/lib/blockchain-data-helper";
import {
  AssetListing,
  AssetStatus,
  ListingStatus,
} from "@/models/asset-listing.model";
import { apiService } from "@/services/api.service";
import { useMarketPlaceStore } from "@/store/marketPlaceStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { wrap } from "comlink";
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
  const queryClient = useQueryClient();
  const pointNameWithAddress = pathname.split("/")[2];
  const [redeemCompletionOverlay, setRedeemCompletionOverlay] = useState({
    shouldShowTradeCompletionOverlay: false,
    children: <></>,
  });
  const pointName = pointNameWithAddress.split("-")[0];
  const pointAddress = pointNameWithAddress.split("-")[1];
  const [selectedListing, setSelectedListing] = useState<
    AssetListing | undefined
  >(undefined);
  const [assetBalance, setAssetBalance] = useState("0");
  const [assetName, setAssetName] = useState("");
  const [assetSymbol, setAssetSymbol] = useState("");

  const marketplaceStore = useMarketPlaceStore();

  const { data: decimalsData, isLoading: isLoadingDecimalsData } =
    useReadContract({
      contract: monetPointsContractFactory(pointAddress),
      method: "decimals",
    });

  const { data: nameData, isLoading: isLoadingNameData } = useReadContract({
    contract: monetPointsContractFactory(pointAddress),
    method: "name",
  });

  const { data: symbolData, isLoading: isLoadingSymbolData } = useReadContract({
    contract: monetPointsContractFactory(pointAddress),
    method: "symbol",
  });

  console.log("walletAddress: ", walletAddress);
  const { data: balanceData, isLoading: isLoadingBalanceData } =
    useReadContract({
      contract: monetPointsContractFactory(pointAddress),
      method: "balanceOf",
      params: [walletAddress as Address],
      queryOptions: {
        enabled: !!walletAddress,
      },
    });

  console.log("balanceData: ", balanceData);
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

  const hasMounted = useHasMounted();

  const useFetchBlockchainListings = (listingCount: number) => {
    return useQuery({
      queryKey: ["blockchain-listings", listingCount],
      queryFn: async () => {
        return await fetchListingsFromBlockchain(listingCount);
      },
      enabled: !!listingCount && !!decimalsData && hasMounted,
      staleTime: 0,
      select: (res) => {
        const formattedData = res
          .filter((listing) => listing.asset === pointAddress)
          .map((listing) => {
            const _amount = BigInt(listing.amount);
            const pricePerPoint = BigInt(listing.pricePerPoint);
            return {
              ...listing,
              Id: String(listing.Id),
              amount: toTokens(BigInt(listing.amount), decimalsData!),
              totalPrice: toTokens(_amount * pricePerPoint, 18),
              pricePerPoint: toTokens(BigInt(listing.pricePerPoint), 18),
            };
          });
        return formattedData;
      },
    });
  };

  const { data: blockchainListings, isLoading: isLoadingBlockchainListings } =
    useFetchBlockchainListings(Number(listingCountData));

  useEffect(() => {
    if (blockchainListings) {
      invalidateBlockchainListings();
      console.log(blockchainListings, "blockchainListings");
      setFormattedAssetListings(blockchainListings);
    }
  }, [blockchainListings]);

  const invalidateBlockchainListings = () => {
    queryClient.invalidateQueries({
      queryKey: ["blockchain-listings", Number(listingCountData)],
    });
  };

  const invalidateApiListings = () => {
    queryClient.invalidateQueries({
      queryKey: [
        "marketplace/point-asset-info",
        {
          pointName,
          pointAddress,
        },
      ],
    });
  };

  const refetchListings = async () => {
    invalidateApiListings();
    invalidateBlockchainListings();
  };

  useEffect(() => {
    if (marketplaceStore.listingCancelled) {
      refetchListings();
      marketplaceStore.setListingCancelled(false);
    }
  }, [marketplaceStore.listingCancelled]);

  useEffect(() => {
    if (marketplaceStore.offerCreated) {
      refetchListings();
      marketplaceStore.setOfferCreated(false);
    }
  }, [marketplaceStore.offerCreated]);

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

  const [formattedAssetListings, setFormattedAssetListings] = useState<
    AssetListing[]
  >([]);

  const { data: assetData, isLoading: isLoadingAssetData } = useReadContract({
    contract: monetMarketplaceContract,
    method: "getAsset",
    params: [pointAddress as Address],
    queryOptions: {
      enabled: !!pointAddress,
    },
  });

  // const getAssetDetails = async () => {
  //   const assetName = await readContract({
  //     contract: monetPointsContractFactory(pointAddress),
  //     method: "name",
  //   });
  //   setAssetName(assetName);

  //   const assetSymbol = await readContract({
  //     contract: monetPointsContractFactory(pointAddress),
  //     method: "symbol",
  //   });
  //   setAssetSymbol(assetSymbol);

  //   console.log("activeAccount?.address: ", activeAccount?.address);
  //   if (activeAccount) {
  //     console.log("decimalsData: ", decimalsData);
  //     const assetBalance = await readContract({
  //       contract: monetPointsContractFactory(pointAddress),
  //       method: "balanceOf",
  //       params: [activeAccount?.address as Address],
  //     });
  //     setAssetBalance(toTokens(assetBalance, decimalsData!));
  //   }
  // };

  // useEffect(() => {
  //   getAssetDetails();
  // }, [activeAccount, decimalsData]);

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
    const pointDecimals = decimalsData!;

    const formattedListings =
      pointAssetInfoData.data.listings.assetListings.map((listing) => {
        const _amount = BigInt(listing.amount);
        const pricePerPoint = BigInt(listing.pricePerPoint);
        return {
          ...listing,
          amount: toTokens(BigInt(listing.amount), pointDecimals),
          totalPrice: toTokens(_amount * pricePerPoint, 18),
          pricePerPoint: toTokens(BigInt(listing.pricePerPoint), 18),
        };
      });
    if (formattedAssetListings.length > 0) return;
    console.log("setting data from api", formattedListings);
    setFormattedAssetListings(formattedListings);
  }, [pointAssetInfoData]);

  const publicListings = formattedAssetListings.filter(
    (listing) => listing.owner !== walletAddress,
  );

  const livePublicListings = publicListings.filter(
    (listing) => listing.status === ListingStatus.LIVE,
  );

  const completedPublicListings = publicListings.filter(
    (listing) => listing.status === ListingStatus.BOUGHT,
  );

  const ownerListings = formattedAssetListings.filter(
    (listing) => listing.owner === walletAddress,
  );

  console.log("assetData: ", assetData);
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
                  {nameData}{" "}
                  <span className="text-muted-foreground">({symbolData})</span>
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
                  {balanceData ? toTokens(balanceData, decimalsData!) : "0"}
                </span>
                <span className="font-light">{symbolData}</span>
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
                name: nameData || "",
                symbol: symbolData || "",
                assetStatus: assetData?.status || AssetStatus.LIVE,
              }}
              assetListing={selectedListing}
              decimals={decimalsData || 0}
              onTradeSuccess={(show: boolean, children: JSX.Element) => {
                setSelectedListing(undefined);
                handleTradeCompletionDialogCallback(show, children);
                refetchListings();
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
