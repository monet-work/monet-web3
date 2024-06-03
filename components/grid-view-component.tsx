import React from "react";
import TradeCard from "./trade-card";
import { AssetListing } from "@/models/asset-listing.model";

type Props = {
  assetListings: AssetListing[];
};

function GridViewComponent({ assetListings }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {assetListings.map((listing) => (
        <TradeCard assetListing={listing} key={listing.Id} />
      ))}
    </div>
  );
}

export default GridViewComponent;
