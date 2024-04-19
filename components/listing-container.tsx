"use client";

import { Listing } from "@/models/listing";
import ListingCard from "./listing-card";

type Props = {
  listings: Listing[];
  activeWalletAddress?: string;
};

const ListingContainer: React.FC<Props> = ({
  listings,
  activeWalletAddress,
}) => {
  const allowBuy = (listing: Listing) =>
    !!activeWalletAddress && listing.address !== activeWalletAddress;
  return (
    <div className="my-4">
      {!listings.length && (
        <div>
          <p className="text-white">No listings found</p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            allowBuy={allowBuy(listing)}
          />
        ))}
      </div>
    </div>
  );
};

export default ListingContainer;
