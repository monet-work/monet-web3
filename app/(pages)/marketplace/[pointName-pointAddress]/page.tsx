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
  const [listingCount, setListingCount] = useState<number>(0);
  const [isBlockchainLoading, setIsBlockchianLoading] = useState<boolean>(true);
  const [listingData, setListingData] = useState<any[]>([]);
  const [decimals, setDecimals] = useState<number>(0);
  const [assetStatus, setAssetStatus] = useState<AssetStatus>(AssetStatus.LIVE);
  const [redeemCompletionOverlay, setRedeemCompletionOverlay] = useState({
    shouldShowTradeCompletionOverlay: false,
    children: <></>,
  });
  const [formattedBlockchainListings, setFormattedBlockchainListings] =
    useState<AssetListing[]>([]);

  const [assetBalance, setAssetBalance] = useState("0");
  const [assetName, setAssetName] = useState("");
  const [assetSymbol, setAssetSymbol] = useState("");

  console.log(formattedBlockchainListings, "formattedBlockchianListings");

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

  const getDecimals = async () => {
    const decimals = await readContract({
      contract: monetPointsContractFactory(pointAddress),
      method: "decimals",
    });
    setDecimals(Number(decimals));
  };
  const ListingCount = async () => {
    if (!activeAccount?.address) return;
    const data = await readContract({
      contract: monetMarketplaceContract,
      method: "getListingCount",
    });
    setListingCount(Number(data));
  };

  useEffect(() => {
    ListingCount();
  }, [activeAccount?.address]);

  const fetchListings = async () => {
    for (let i = 1; i <= listingCount!; i++) {
      const Listings = async () => {
        const data = await readContract({
          contract: monetMarketplaceContract,
          method: "getListing",
          params: [BigInt(i)],
        });

        if (data.asset === pointAddress) {
          // console.log(data, "data", i);
          setListingData((prev: any) => [...prev, data]);
        }
      };

      await Listings();
    }

    setIsBlockchianLoading(false);
  };

  useEffect(() => {
    getDecimals();
    const formattedListings = listingData.map((listing) => {
      // console.log("Listing: ", listing);
      const _amount = BigInt(listing.amount);
      // console.log(decimals);
      const pricePerPoint = BigInt(listing.pricePerPoint);
      return {
        ...listing,
        Id: Number(listing.Id),
        amount: toTokens(BigInt(listing.amount), decimals),
        totalPrice: toTokens(_amount * pricePerPoint, 18),
        pricePerPoint: toTokens(BigInt(listing.pricePerPoint), 18),
      };
    });
    console.log(formattedListings, "formattedListings");
    setFormattedBlockchainListings(formattedListings);
  }, [isBlockchainLoading]);
  useEffect(() => {
    if (listingCount != 0) {
      fetchListings();
    }
  }, [listingCount]);

  // if (isBlockchainLoading === false) {
  //   console.log(listingData, "listingData");
  // }

  const pointName = pointNameWithAddress.split("-")[0];
  const pointAddress = pointNameWithAddress.split("-")[1];
  const [selectedListing, setSelectedListing] = useState<
    AssetListing | undefined
  >(undefined);

  const [formattedAssetListings, setFormattedAssetListings] = useState<
    AssetListing[]
  >([]);

  const getAssetDetails = async () => {
    const decimals = await readContract({
      contract: monetPointsContractFactory(pointAddress),
      method: "decimals",
    });

    const assetStatus = await readContract({
      contract: monetMarketplaceContract,
      method: "getAsset",
      params: [pointAddress as Address],
    });
    setAssetStatus(Number(assetStatus.status));

    const assetName = await readContract({
      contract: monetPointsContractFactory(pointAddress),
      method: "name",
    });
    setAssetName(assetName);

    const assetSymbol = await readContract({
      contract: monetPointsContractFactory(pointAddress),
      method: "symbol",
    });
    setAssetSymbol(assetSymbol);

    console.log("activeAccount?.address: ", activeAccount?.address);
    if (activeAccount) {
      const assetBalance = await readContract({
        contract: monetPointsContractFactory(pointAddress),
        method: "balanceOf",
        params: [activeAccount?.address as Address],
      });
      setAssetBalance(toTokens(assetBalance, decimals));
    }
  };

  useEffect(() => {
    getAssetDetails();
  }, [activeAccount]);

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
  // console.log(pointAssetInfoData, "pointAssetInfoData");

  useEffect(() => {
    if (!pointAssetInfoData?.data) return;
    const pointDecimals = pointAssetInfoData.data.decimals;

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
          {isLoading ? (
            <Skeleton className="h-20 w-full" />
          ) : (
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl pb-2">
                  {assetName}{" "}
                  <span className="text-muted-foreground">({assetSymbol})</span>
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
                <span className="font-bold mr-2">{assetBalance}</span>
                <span className="font-light">{assetSymbol}</span>
              </div>
            </div>
          )}
          <div>
            <h3 className="mb-4">Live public listings</h3>
            <TradesView
              assetListings={livePublicListings || []}
              loading={isLoading}
              onListingSelected={(listing) => setSelectedListing(listing)}
            />
          </div>
          <div className="mt-8">
            <h3 className="mb-4 text-muted-foreground">
              Recently completed listings
            </h3>
            <TradesView
              assetListings={completedPublicListings || []}
              loading={isLoading}
            />
          </div>
          <div className="mt-8">
            <h3 className="mb-4 text-muted-foreground">Your listings</h3>
            <UserTradeView
              assetListings={ownerListings || []}
              loading={isLoading}
            />
          </div>
        </div>
        <div className="w-full md:w-1/3 relative">
          <div className="sticky top-[100px] mt-8">
            <TradeDetails
              pointInfo={{
                name: assetName || "",
                symbol: assetSymbol || "",
                assetStatus: assetStatus,
              }}
              assetListing={selectedListing}
              decimals={decimals}
              onTradeSuccess={(show: boolean, children: JSX.Element) => {
                setSelectedListing(undefined);
                handleTradeCompletionDialogCallback(show, children);
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
