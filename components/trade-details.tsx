"use client";
import React, { useState } from "react";

type Props = {
  isActive: boolean;
  Data: any;
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
import { Info, TextSelectIcon } from "lucide-react";
import { Input } from "./ui/input";

const TradeDetails: React.FC<Props> = ({ isActive, Data }) => {
  return (
    <Card className="w-full">
      <CardContent className="flex flex-col pt-4 w-full ">
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
        <div className="mt-4 rounded-lg bg-neutral-900 p-4 ">
          <div className="w-full flex justify-between">
            {" "}
            <p className="text-base font-medium text-green-500">BUYING</p>{" "}
            <p className="text-sm">
              Max <span className="text-neutral-400">826 Pts</span>
            </p>
          </div>

          <div className="flex items-center justify-between text-xl gap-2">
            <Input
              type="number"
              className="bg-transparent text-xl outline-none my-1 border-none active:outline-none active:border-none focus:outline-none focus:border-none"
            />
            <Image src={"/images/For.svg"} width={26} height={26} alt={""} />
          </div>
        </div>
        <Button className="w-full">Connect Wallet</Button>
      </CardContent>

     
    </Card>
  );
};

export default TradeDetails;
