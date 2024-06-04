"use client";
import React, { useState } from "react";

type Props = {
  assetListing: AssetListing;
};
import { Card, CardContent } from "@/components/ui/card";

import { Button } from "./ui/button";
import Image from "next/image";
import { Pointer } from "lucide-react";
import { Input } from "./ui/input";
import { AssetListing } from "@/models/asset-listing.model";

const TradeDetails: React.FC<Props> = ({ assetListing }) => {
  return (
    <Card className="w-full bg-muted ">
      <CardContent className="flex flex-col pt-4 w-full min-h-[400px]">
        {!assetListing ? (
          <div className="text-muted-foreground flex items-center justify-center h-full min-h-[400px]">
            <div className="flex flex-col items-center gap-8">
              <Pointer className="h-12 w-12" />
              <p className="text-lg">Select an offer to view details</p>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default TradeDetails;
