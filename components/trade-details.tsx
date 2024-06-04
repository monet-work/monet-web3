"use client";
import React from "react";

type Props = {
  assetListing?: AssetListing;
  onTradeSuccess?: () => void;
  onTradeError?: () => void;
};
import { Card, CardContent } from "@/components/ui/card";

import { Button } from "./ui/button";
import { Pointer } from "lucide-react";
import {
  AssetListing,
  ListingStatus,
  ListingType,
} from "@/models/asset-listing.model";
import clsx from "clsx";
import { PreparedTransaction, prepareContractCall, toWei } from "thirdweb";
import { monetMarketplaceContract } from "@/app/contract-utils";
import { toast } from "sonner";
import { useSendTransaction } from "thirdweb/react";

const TradeDetails: React.FC<Props> = ({ assetListing, onTradeError, onTradeSuccess }) => {
  const { mutate: sendTransaction, isPending, isError } = useSendTransaction();
  const handleListingTrade = async () => {
    if (!assetListing || !assetListing?.Id || !assetListing.amount) return;
    const call = async () => {
      const transaction = await prepareContractCall({
        contract: monetMarketplaceContract,
        method: "trade",
        params: [BigInt(assetListing.Id), BigInt(assetListing.amount)],
        value: BigInt(toWei(assetListing.totalPrice)),
      });

      await sendTransaction(transaction as PreparedTransaction, {
        onSuccess: (result) => {
          onTradeSuccess && onTradeSuccess();
        },

        onError: (error) => {
          toast.error("Transaction failed");
          onTradeError && onTradeError();
        },
      });
    };

    call();
  };

  return (
    <Card
      className={clsx("w-full bg-muted", {
        "outline outline-2 outline-green-600":
          assetListing?.listingType === ListingType.BUY,
        "outline outline-2 outline-red-600":
          assetListing?.listingType === ListingType.SELL,
      })}
    >
      <CardContent className="flex flex-col pt-4 w-full min-h-[400px] h-full">
        {!assetListing ? (
          <div className="text-muted-foreground flex items-center justify-center h-full min-h-[400px]">
            <div className="flex flex-col items-center gap-8">
              <Pointer className="h-12 w-12" />
              <p className="text-lg">Select an offer to view details</p>
            </div>
          </div>
        ) : null}

        {assetListing ? (
          <div className="flex flex-col flex-grow">
            <div className="flex-grow">
              <p className="text-2xl">
                {assetListing.listingType === ListingType.BUY
                  ? "Selling"
                  : "Buying"}
              </p>
              <h3 className="font-bold text-4xl mt-2">
                {assetListing.amount} <span className="font-thin">tokens</span>
              </h3>
              <p className="mt-2">for an offer price of</p>
              <div className="mt-2">
                <span className="text-3xl font-semibold">
                  {assetListing.totalPrice}
                </span>
                <span className="text-sm font-normal">ETH</span>
              </div>
              <span className="text-xs mt-2 text-muted-foreground">
                ({assetListing.pricePerPoint} ETH per point)
              </span>
              <p className="mt-2">from</p>
              <p className="text-xs mt-2">{assetListing.owner}</p>
            </div>

            <div className="mt-auto">
              <Button
                className="mt-2 w-full"
                size={"lg"}
                disabled={assetListing.status !== ListingStatus.LIVE}
                onClick={handleListingTrade}
              >
                {assetListing.status === ListingStatus.LIVE ? (
                  <span>
                    {assetListing.listingType === ListingType.BUY
                      ? "Sell"
                      : "Buy"}
                  </span>
                ) : null}

                {assetListing.status !== ListingStatus.LIVE ? (
                  <span>
                    {assetListing.status === ListingStatus.BOUGHT
                      ? "Bought"
                      : null}
                    {assetListing.status === ListingStatus.CANCELLED
                      ? "Cancelled"
                      : null}
                  </span>
                ) : null}
              </Button>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default TradeDetails;
