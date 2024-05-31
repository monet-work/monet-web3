import React from "react";

type Props = {
  Offer: string;
  For: string;
  OfferPrice: string;
  ForPrice: string;
  OfferImg: string;
  ForImg: string;
};
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "./ui/button";
import Image from "next/image";

export function TradeGridCard({
  Offer,
  For,
  OfferPrice,
  ForPrice,
  OfferImg,
  ForImg,
}: Props) {
  return (
    <div className="w-1/5 sm:w-1/2 lg:w-1/4 p-2">
      <Card className=" w-full  duration-200 transition cursor-pointer  hover:bg-neutral-900">
        <CardContent className="flex pt-4 w-full justify-between">
          <div className="flex flex-col gap-1 items-start">
            <p className="text-sm text-neutral-400">OFFER</p>
            <div className="flex items-center gap-2">
              {Offer} <Image src={OfferImg} width={20} height={20} alt={""} />
            </div>
            <p className="text-xs text-green-500 ">{OfferPrice}</p>
          </div>

          <div className="flex flex-col gap-1 items-end">
            <p className="text-sm text-neutral-400">FOR</p>
            <div className="flex gap-2 items-center">
              {For} <Image src={ForImg} width={20} height={20} alt={""} />
            </div>
            <p className="text-xs ">{ForPrice}</p>
          </div>
        </CardContent>
        <CardFooter className="flex border pt-4 pb-4 justify-between">
          <Button variant={"outline"}>PARTIAL</Button>
          <Button>BUY</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
