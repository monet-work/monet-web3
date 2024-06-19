import React from "react";

type Props = {
  assetListing: AssetListing;
};
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { Button } from "./ui/button";
import Image from "next/image";
import {
  AssetListing,
  ListingFillType,
  ListingType,
} from "@/models/asset-listing.model";

const TradeCard: React.FC<Props> = ({ assetListing }) => {
  return (
    <div className="w-full">
      <Card className=" w-full  duration-200 transition cursor-pointer  hover:bg-neutral-700">
        <CardContent className="flex pt-4 w-full justify-between">
          <div className="flex flex-col gap-1 items-start">
            <p className="text-xs text-neutral-400">OFFER</p>
            <div className="flex items-center gap-2">
              {/* {Offer} <Image src={OfferImg} width={20} height={20} alt={""} /> */}
            </div>
            <p className="text-xs text-green-500 ">{""}</p>
          </div>

          <div className="flex flex-col gap-1 items-end">
            <p className="text-xs text-neutral-400">FOR</p>
            <div className="flex gap-2 items-center">
              {/* {For} <Image src={ForImg} width={20} height={20} alt={""} /> */}
            </div>
            <p className="text-xs ">{assetListing.amount}</p>
          </div>
        </CardContent>
        <CardFooter className="flex border pb-0 py-3 justify-between">
          <Button variant={"outline"} size={"xs"}>
            {assetListing.fillType === ListingFillType.PARTIAL
              ? "PARTIAL"
              : "FULL"}
          </Button>
          <Button variant={"secondary"} size={"xs"}>
            {assetListing.listingType === ListingType.BUY ? "SELL" : "BUY"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TradeCard;
