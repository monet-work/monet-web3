"use client";

import ListingForm from "@/components/forms/listing-form";
import ListingContainer from "@/components/listing-container";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { elpMarketplaceContract } from "../thirdweb";
import { useEffect, useState } from "react";
import { Listing, ListingStatus } from "@/models/listing";
import { toEther, toTokens, toUnits } from "thirdweb";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import useThirdwebEvents from "@/hooks/useThirdwebEvents";

const ListingsPage: React.FC = () => {
  const account = useActiveAccount();
  const currentUserWalletAddress = account?.address;

  const {
    data: listingsData,
    isLoading: isLoadingListings,
    refetch: refetchListingsData,
  } = useReadContract({
    contract: elpMarketplaceContract,
    method: "getListings",
    params: [],
  });

  const [listings, setListings] = useState<Listing[] | undefined>([]);

  const { eventsFromMarketplaceContract } = useThirdwebEvents();

  useEffect(() => {
    console.log(eventsFromMarketplaceContract, "eventsData");
  }, [eventsFromMarketplaceContract]);

  useEffect(() => {
    const formattedListings = listingsData?.map(
      (listing: any, index: number) => {
        return {
          id: index.toString(),
          address: listing.seller,
          quantity: toTokens(listing.quantity, 4).toString(),
          amount: toEther(listing.totalPrice),
          status: listing.listingStatus,
        };
      }
    );
    setListings(formattedListings);

    if (formattedListings) {
      console.log("formattedListings", formattedListings);
    }
  }, [listingsData]);

  const publicListings = listings?.filter(
    (listing) =>
      listing.status === ListingStatus.LIVE &&
      listing.address !== currentUserWalletAddress
  );

  const userListings = listings?.filter(
    (listing) => listing.address === currentUserWalletAddress
  );

  const liveUserListings = userListings?.filter(
    (listing) => listing.status === ListingStatus.LIVE
  );

  const boughtUserListings = userListings?.filter(
    (listing) => listing.status === ListingStatus.BOUGHT
  );

  const cancelledUserListings = userListings?.filter(
    (listing) => listing.status === ListingStatus.CANCELLED
  );

  return (
    <main className="bg-black min-h-screen py-8">
      <div className="container">
        <div className="flex justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"outline"}>Create a listing</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Listing</DialogTitle>
              </DialogHeader>
              <div>
                <ListingForm />
              </div>
            </DialogContent>
          </Dialog>
        </div>
        {/* Show public listings */}
        <section className="py-8">
          <h3 className="text-2xl md:text-4xl text-white">Public Listings</h3>

          {isLoadingListings && (
            <div className="text-white">
              <p>Loading Listings...</p>
              <Skeleton className="h-12 w-[200px] mt-4" />
            </div>
          )}
          {!isLoadingListings && (
            <ListingContainer
              listings={publicListings || []}
              activeWalletAddress={currentUserWalletAddress}
              onListingUpdated={() => refetchListingsData()}
            />
          )}
        </section>

        {/* Show user listings */}
        <section className="py-8">
          <h3 className="text-2xl md:text-4xl text-white">My Listings</h3>

          {isLoadingListings && (
            <div className="text-white">
              <p>Loading Listings...</p>
              <Skeleton className="h-12 w-[200px] mt-4" />
            </div>
          )}
          {!isLoadingListings && (
            <Tabs defaultValue="active" className="text-white mt-8">
              <TabsList className="flex gap-4">
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="sold">Sold</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>
              <TabsContent value="active">
                <ListingContainer
                  listings={liveUserListings || []}
                  activeWalletAddress={currentUserWalletAddress}
                  onListingUpdated={() => refetchListingsData()}
                />
              </TabsContent>
              <TabsContent value="sold">
                <ListingContainer
                  listings={boughtUserListings || []}
                  activeWalletAddress={currentUserWalletAddress}
                />
              </TabsContent>
              <TabsContent value="cancelled">
                <ListingContainer
                  listings={cancelledUserListings || []}
                  activeWalletAddress={currentUserWalletAddress}
                />
              </TabsContent>
            </Tabs>
          )}
        </section>
      </div>
    </main>
  );
};

export default ListingsPage;
