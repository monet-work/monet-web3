"use client";
/* global BigInt */
import React, { useEffect, useState } from "react";

type Props = {
  pointInfo?: {
    name: string;
    symbol: string;
    assetStatus: AssetStatus;
  };
  decimals: number;
  assetListing?: AssetListing;
  onTradeSuccess?: (show: boolean, children: JSX.Element) => void;
  onTradeError?: () => void;
};
import { Card, CardContent } from "@/components/ui/card";

import { Button } from "./ui/button";
import { Ban, ExternalLink, Pointer } from "lucide-react";
import {
  AssetListing,
  AssetStatus,
  ListingStatus,
  ListingType,
} from "@/models/asset-listing.model";
import clsx from "clsx";
import {
  Address,
  PreparedTransaction,
  prepareContractCall,
  readContract,
  toTokens,
  toUnits,
  toWei,
} from "thirdweb";
import {
  monetMarketplaceContract,
  monetPointsContractFactory,
} from "@/app/contract-utils";
import { toast } from "sonner";
import { useActiveAccount, useSendAndConfirmTransaction } from "thirdweb/react";
import { usePathname } from "next/navigation";
import confetti from "canvas-confetti";
import {
  celebratoryConfetti,
  schoolPrideConfetti,
} from "@/lib/confetti-helper";

const TradeDetails: React.FC<Props> = ({
  assetListing,
  pointInfo,
  decimals,
  onTradeError,
  onTradeSuccess,
}) => {
  const { name, symbol } = pointInfo || { name: "", symbol: "" };
  const pathname = usePathname();
  const activeAccount = useActiveAccount();
  const pointAddress = pathname.split("/")[2].split("-")[1];
  const {
    mutate: sendTransaction,
    isPending,
    isError,
  } = useSendAndConfirmTransaction();
  const [totalPrice, setTotalPrice] = useState<string>("");

  useEffect(() => {
    if (!assetListing || !assetListing?.Id || !assetListing.amount) return;
    calculateTotalPrice(
      assetListing?.asset,
      assetListing?.amount,
      assetListing?.pricePerPoint,
    );
  }, [totalPrice, assetListing]);

  const calculateTotalPrice = async (
    asset: string,
    amount: string,
    pricePerPoint: string,
  ) => {
    const decimals = await readContract({
      contract: monetPointsContractFactory(asset),
      method: "decimals",
    });
    const _totalPrice = toUnits(amount, decimals) * toWei(pricePerPoint);
    setTotalPrice(String(_totalPrice));
  };

  const handleListingTrade = async () => {
    if (!assetListing || !assetListing?.Id || !assetListing.amount) return;

    const isSelling = assetListing.listingType === ListingType.BUY;

    const decimals = await readContract({
      contract: monetPointsContractFactory(assetListing.asset),
      method: "decimals",
    });

    const executeTrade = async () => {
      const transaction = await prepareContractCall({
        contract: monetMarketplaceContract,
        method: "trade",
        params: [
          BigInt(assetListing.Id),
          toUnits(assetListing.amount, decimals),
        ],
        value:
          assetListing.listingType === ListingType.SELL
            ? BigInt(totalPrice)
            : undefined,
      });

      await sendTransaction(transaction as PreparedTransaction, {
        onSuccess: (result) => {
          console.log({ result }, "result");
          toast.success("Trade executed successfully");
          celebratoryConfetti();
          onTradeSuccess &&
            onTradeSuccess(
              true,
              <div>
                <h3>Hello Trader 🧑🏻‍💻,</h3>
                <div>
                  {"You just " +
                    (assetListing.listingType === ListingType.SELL
                      ? " bought "
                      : " sold ") +
                    (assetListing.amount + " " + symbol) +
                    " at a great price of " +
                    toTokens(BigInt(totalPrice), 18) +
                    " ETH 🤑🤑🤑"}
                </div>
                <div className="text-xs mt-1 text-muted-foreground">
                  View your transaction:
                  <a
                    href={`https://sepolia.basescan.org/tx/${result.transactionHash}`}
                    target="_blank"
                    className="flex items-center gap-1 hover:underline"
                  >
                    {result.transactionHash}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>,
            );
        },

        onError: (error) => {
          console.log(error, "error");
          toast.error("Transaction failed");
          onTradeError && onTradeError();
        },
      });
    };

    if (isSelling) {
      // When performing a sell trade, the marketplace needs to be approved
      // to sell the assets on behalf of the seller

      const allowanceFunction = async () => {
        if (!activeAccount) return;
        const data = await readContract({
          contract: monetPointsContractFactory(pointAddress),
          method: "allowance",
          params: [
            activeAccount?.address,
            process.env.NEXT_PUBLIC_MONET_MARKETPLACE_CONTRACT! as Address,
          ],
        });
        console.log(data, "allowance data");
        return toTokens(data, decimals);
      };

      const allowanceValue = await allowanceFunction();
      // console.log(
      //   allowanceValue,
      //   values.quantity,
      //   Number(allowanceValue) < Number(values.quantity)
      // );

      const performApproval = async (amount: string) => {
        const transaction = await prepareContractCall({
          contract: monetPointsContractFactory(pointAddress),
          method: "approve",
          params: [
            monetMarketplaceContract.address as Address,
            BigInt(toUnits(amount, decimals)),
          ],
        });
        await sendTransaction(transaction as PreparedTransaction, {
          onSuccess: async () => {
            console.log("Approved");
            await executeTrade();
            return;
          },
          onError: () => {
            console.log("Error approving");
          },
        });
      };

      if (BigInt(allowanceValue!) < BigInt(assetListing.amount)) {
        await performApproval(assetListing.amount);
      } else {
        await executeTrade();
        return;
      }
    } else {
      await executeTrade();
      return;
    }
  };

  const getPricePerPoint = (pricePerPoint: string) => {
    return toTokens(toUnits(toWei(pricePerPoint).toString(), decimals), 18);
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
        {assetListing && pointInfo?.assetStatus === AssetStatus.DOWN ? (
          <div className="text-muted-foreground flex items-center justify-center h-full min-h-[400px]">
            <div className="flex flex-col items-center gap-8">
              <Ban className="h-12 w-12 text-red-500" />
              <p className="text-lg text-center ">
                Trading is temporarily disabled; please try again later.
              </p>
            </div>
          </div>
        ) : null}

        {assetListing && pointInfo?.assetStatus === AssetStatus.LIVE ? (
          <div className="flex flex-col flex-grow">
            <div className="flex-grow">
              <p className="text-2xl">
                {assetListing.listingType === ListingType.BUY
                  ? "Selling"
                  : "Buying"}
              </p>
              <h3 className="font-bold text-4xl mt-2">
                {assetListing.amount}{" "}
                <span className="font-thin">{symbol || "points"}</span>
              </h3>
              <p className="mt-2">for an offer price of</p>
              <div className="mt-2">
                <span className="text-3xl font-semibold">
                  {toTokens(BigInt(totalPrice), 18)}
                </span>
                <span className="text-sm font-normal">ETH</span>
              </div>
              <span className="text-xs mt-2 text-muted-foreground">
                ({getPricePerPoint(assetListing.pricePerPoint)} ETH per{" "}
                {symbol || "point"})
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
                loading={isPending}
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
