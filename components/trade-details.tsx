"use client";

import React, { useEffect, useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

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
  ListingFillType,
  AssetStatus,
  ListingStatus,
  ListingType,
} from "@/models/asset-listing.model";
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
import { celebratoryConfetti } from "@/lib/confetti-helper";
import { cn } from "@/lib/utils";

const marks = {
  0: "0%",
  25: "25%",
  50: "50%",
  75: "75%",
  100: "100%",
};

const TradeDetails: React.FC<Props> = ({
  assetListing,
  pointInfo,
  decimals,
  onTradeError,
  onTradeSuccess,
}) => {
  const { symbol } = pointInfo || { name: "", symbol: "" };
  const pathname = usePathname();
  const activeAccount = useActiveAccount();
  const pointAddress = pathname.split("/")[2].split("-")[1];
  const {
    mutate: sendTransaction,
    isPending,
    isError,
  } = useSendAndConfirmTransaction();
  const [totalPrice, setTotalPrice] = useState<string>("");
  const [assetAmount, setAssetAmount] = useState<string>("");

  const isPartialFillType = assetListing?.fillType === ListingFillType.PARTIAL;

  useEffect(() => {
    if (!assetListing || !assetListing?.Id || !assetListing.amount) return;
    calculateTotalPrice(
      assetListing?.asset,
      assetListing?.amount,
      assetListing?.pricePerPoint,
    );
  }, [assetListing]);

  useEffect(() => {
    if (!assetListing || !assetListing?.Id || !assetListing.amount) return;
    setAssetAmount(assetListing.amount);
  }, [assetListing]);

  const calculatePartialFill = (value: number) => {
    if (!assetListing || !assetListing?.Id || !assetListing.amount) return;
    const _amount = (Number(assetListing.amount) * value) / 100;
    setAssetAmount(String(_amount));

    calculateTotalPrice(
      assetListing?.asset,
      String(_amount),
      assetListing?.pricePerPoint,
    );
  };

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
        params: [BigInt(assetListing.Id), toUnits(assetAmount, decimals)],
        value:
          assetListing.listingType === ListingType.SELL
            ? BigInt(totalPrice)
            : undefined,
      });

      await sendTransaction(transaction as PreparedTransaction, {
        onSuccess: (result) => {
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
                    (assetAmount + " " + symbol) +
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
      className={cn("w-full bg-muted", {
        "outline outline-2 outline-green-600":
          assetListing?.listingType === ListingType.BUY,
        "outline outline-2 outline-red-600":
          assetListing?.listingType === ListingType.SELL,
      })}
    >
      <CardContent className="flex flex-col pt-4 w-full min-h-[450px] h-full">
        {!assetListing ? (
          <div className="text-muted-foreground flex items-center justify-center h-full min-h-[450px]">
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
                {assetAmount}{" "}
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

              <div
                className={cn(
                  {
                    hidden: !isPartialFillType,
                  },
                  "mt-8",
                )}
              >
                <Slider
                  styles={{
                    handle: {
                      backgroundColor: "hsl(var(--primary))",
                      borderColor: "hsl(var(--primary))",
                    },
                    rail: {
                      backgroundColor: "hsl(var(--muted-foreground))",
                    },
                    track: {
                      backgroundColor: "hsl(var(--primary))",
                    },
                  }}
                  activeDotStyle={{
                    backgroundColor: "hsl(var(--primary))",
                    borderColor: "hsl(var(--primary))",
                    outline: "none",
                  }}
                  dotStyle={{
                    backgroundColor: "hsl(var(--muted))",
                    borderColor: "hsl(var(--muted-foreground))",
                    top: -6,
                    height: 16,
                    width: 16,
                  }}
                  min={0}
                  max={100}
                  marks={marks}
                  defaultValue={isPartialFillType ? 0 : 100}
                  step={25}
                  onChangeComplete={(value) => {
                    console.log(value, "value");
                    calculatePartialFill(value as number);
                  }}
                />
              </div>
            </div>

            <div className="mt-auto">
              <Button
                className="mt-2 w-full"
                size={"lg"}
                disabled={
                  assetListing.status !== ListingStatus.LIVE ||
                  assetAmount === "0"
                }
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
