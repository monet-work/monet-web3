"use client";

import { Listing, ListingStatus } from "@/models/listing";
import ListingCard from "./listing-card";
import { useSendTransaction } from "thirdweb/react";
import { PreparedTransaction, prepareContractCall, toWei } from "thirdweb";
import { elpMarketplaceContract } from "@/app/contract-utils";
import { useEffect } from "react";
import { toast } from "sonner";

type Props = {
  listings: Listing[];
  activeWalletAddress?: string;
  onListingUpdated?: () => void;
};

const ListingContainer: React.FC<Props> = ({
  listings,
  activeWalletAddress,
  onListingUpdated,
}) => {
  const {
    mutate: sendBuyTransaction,
    isError: isBuyError,
    isSuccess: isBuySuccess,
    isPending: isBuyLoading,
  } = useSendTransaction();
  const {
    mutate: sendCancelTransaction,
    isError: isCancelError,
    isSuccess: isCancelSuccess,
    isPending: isCancelLoading,
  } = useSendTransaction();

  const performBuyTransaction = async (listingId: string, amount: string) => {
    const transaction = await prepareContractCall({
      contract: elpMarketplaceContract,
      method: "buyListing",
      params: [BigInt(listingId)],
      value: toWei(amount),
    });
    await sendBuyTransaction(transaction as PreparedTransaction, {
      onSuccess: () => {
        onListingUpdated && onListingUpdated();
      },
      onError: () => {
        console.log("Error buying");
      },
    });

    console.log(transaction, "transaction");
  };
  const performCancelTransaction = async (listingId: string) => {
    const transaction = await prepareContractCall({
      contract: elpMarketplaceContract,
      method: "cancelListing",
      params: [BigInt(listingId)],
    });
    await sendCancelTransaction(transaction as PreparedTransaction, {
      onSuccess: () => {
        onListingUpdated && onListingUpdated();
      },
      onError: () => {
        console.log("Error cancelling");
      },
    
    });

    console.log(transaction, "transaction");
  };

  const allowBuy = (listing: Listing) =>
    !!activeWalletAddress && listing.address !== activeWalletAddress;

  const allowCancel = (listing: Listing) =>
    !!activeWalletAddress &&
    listing.address === activeWalletAddress &&
    listing.status === ListingStatus.LIVE;

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
            onBuy={() => {
              listing.id && performBuyTransaction(listing.id, listing.amount);
            }}
            allowCancel={allowCancel(listing)}
            onCancel={() => {
              listing.id && performCancelTransaction(listing.id);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ListingContainer;
