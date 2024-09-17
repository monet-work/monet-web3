import React from "react";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
} from "./ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";

import { Button } from "./ui/button";
import Image from "next/image";
import { Info, TextSelectIcon } from "lucide-react";
import { Input } from "./ui/input";

type Props = {};

function SellOfferComponent({}: Props) {
  const [pricePerPoint, setPricePerPoint] = React.useState(0);
  const [collateral, setCollateral] = React.useState(0);
  const [amount, setAmount] = React.useState(0);
  return (
    <div className="w-full mt-5">
      <h1 className="text-xl">Create a Sell Offer</h1>
      <div className="flex flex-col pt-2 w-full ">
        <div className="flex pt-4 w-full justify-between">
          <div className="flex flex-col gap-1 items-start">
            <p className="text-sm text-neutral-400">OFFER</p>
            <div className="flex items-center text-xl gap-2">
              HyperLiquid/ETH{" "}
              <Image src={"/images/For.svg"} width={26} height={26} alt={""} />
            </div>
            <p className="text-sm font-medium text-green-500 ">
              $5.45{" "}
              <span className="text-gray-300  text-xs font-normal">
                0.000145 ETH
              </span>
            </p>
          </div>
          <div>
            <Button
              className="items-center text-neutral-400 gap-1 "
              variant={"outline"}
            >
              <Info className="w-4 h-4" /> Offer Info
            </Button>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-1  ">
          <div className="bg-neutral-900 p-4 rounded-lg">
            <div className="w-full flex justify-between">
              {" "}
              <p className="text-base font-medium text-neutral-500">
                PRICE PER POINT
              </p>{" "}
            </div>

            <div className="flex items-center justify-between text-xl gap-2">
              <Input
                type="number"
                className="bg-transparent text-xl outline-none my-1 border-none active:outline-none active:border-none focus:outline-none focus:border-none"
              />
              <Image src={"/images/For.svg"} width={26} height={26} alt={""} />
            </div>
          </div>

          <div className="bg-neutral-900 p-4 rounded-lg">
            <div className="w-full flex justify-between">
              {" "}
              <p className="text-base font-medium text-neutral-500">
                AMOUNT
              </p>{" "}
            </div>

            <div className="flex items-center justify-between text-xl gap-2">
              <Input
                type="number"
                className="bg-transparent text-xl outline-none my-1 border-none active:outline-none active:border-none focus:outline-none focus:border-none"
              />
              <Image src={"/images/For.svg"} width={26} height={26} alt={""} />
            </div>
          </div>
          <div className="bg-neutral-900 p-4 rounded-lg">
            <div className="w-full flex justify-between">
              {" "}
              <p className="text-base font-medium text-neutral-500">
                COLLATERAL
              </p>{" "}
            </div>

            <div className="flex items-center justify-between text-xl gap-2">
              <Input
                type="number"
                className="bg-transparent text-xl outline-none my-1 border-none active:outline-none active:border-none focus:outline-none focus:border-none"
              />
              <Image src={"/images/For.svg"} width={26} height={26} alt={""} />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col mt-2 py-2 gap-2">
        <AlertDialogCancel className="w-full">Cancel</AlertDialogCancel>
        <AlertDialogAction className="w-full">Create a offer</AlertDialogAction>
      </div>
    </div>
  );
}

export default SellOfferComponent;
