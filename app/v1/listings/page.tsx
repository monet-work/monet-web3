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
import {
  useActiveAccount,
  useReadContract,
  useSendTransaction,
} from "thirdweb/react";
import { elpContract, elpMarketplaceContract } from "../../thirdweb";
import { useEffect, useState } from "react";
import { Listing, ListingStatus } from "@/models/listing";
import {
  PreparedTransaction,
  prepareContractCall,
  toEther,
  toTokens,
  toUnits,
  toWei,
} from "thirdweb";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import useThirdwebEvents from "@/hooks/useThirdwebEvents";
import LoadingMessage from "@/components/loading-message";
import { toast } from "sonner";
import WalletConnectWrapper from "@/components/wallet-connect-wrapper";
import SubNavbar from "@/components/sub-navbar";

type DRAFT_LISTING_STATE = "DORMANT" | "APPROVING" | "CREATING";

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

  const [showDialog, setShowDialog] = useState(false);
  const [listings, setListings] = useState<Listing[] | undefined>([]);
  const [draftListing, setDraftListing] = useState<
    | {
        value: string;
        amount: string;
      }
    | undefined
  >(undefined);
  const [draftListingState, setDraftListingState] =
    useState<DRAFT_LISTING_STATE>("DORMANT");

  const {
    mutate: sendApproveTransaction,
    isPending: isApprovalPending,
    isError: isErrorApproving,
  } = useSendTransaction();

  const {
    mutate: sendCreateListingTransaction,
    isPending: isCreateListingPending,
    isError: isErrorCreateListing,
  } = useSendTransaction();

  const performApproval = async (address: string, quantity: string) => {
    const transaction = await prepareContractCall({
      contract: elpContract,
      method: "approve",
      params: [address, toUnits(quantity, 4)],
    });
    await sendApproveTransaction(transaction as PreparedTransaction, {
      onSuccess: () => {
        console.log("Approved");
        setDraftListingState("CREATING");
      },
      onError: () => {
        console.log("Error approving");
      },
    });
  };

  const performCreateListing = async (quantity: string, amount: string) => {
    const transaction = await prepareContractCall({
      contract: elpMarketplaceContract,
      method: "createListing",
      params: [toUnits(quantity, 4), toWei(amount)],
    });

    await sendCreateListingTransaction(transaction as PreparedTransaction, {
      onSuccess: () => {
        console.log("Listing Created");
        toast.message("Listing Created", {
          description: "Your listing has been created successfully",
        });
        setDraftListing(undefined);
        setDraftListingState("DORMANT");
        setShowDialog(false);
      },
      onError: () => {
        console.log("Error while creating listing");
        toast.message("Error while creating listing", {
          description: "Please try again",
        });
      },
    });
  };

  const { eventsFromMarketplaceContract } = useThirdwebEvents(); //not working yet

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

  const handleCreateListing = async (values: {
    quantity: string;
    amount: string;
  }) => {
    setDraftListing({
      value: values.quantity,
      amount: values.amount,
    });
    setDraftListingState("APPROVING");
    await performApproval(elpMarketplaceContract.address, values.quantity);
  };

  const handleConfirmListing = async (values: {
    quantity: string;
    amount: string;
  }) => {
    await performCreateListing(values.quantity, values.amount);
  };

  return (
    <main className="bg-black min-h-screen py-8">

      <div className="container">
        <div className="flex justify-end">
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button variant={"outline"}>Create a listing</Button>
            </DialogTrigger>
            <DialogContent>
              {draftListingState === "DORMANT" && (
                <DialogHeader>
                  <DialogTitle>Create Listing</DialogTitle>
                </DialogHeader>
              )}
              <div>
                {draftListingState === "DORMANT" && (
                  <ListingForm onSubmitForm={handleCreateListing} />
                )}
                {draftListingState === "APPROVING" && <LoadingMessage message="Approving the marketplace to sell points" />}

                {draftListingState === "CREATING" && (
                  <div>
                    <p>
                      Creating a listing of {draftListing?.value} ELP points at
                      a price of {draftListing?.amount} Eth
                    </p>
                    <Button
                      className="mt-4 mx-auto"
                      onClick={() =>
                        draftListing &&
                        handleConfirmListing({
                          quantity: draftListing.value,
                          amount: draftListing.amount,
                        })
                      }
                    >
                      Confirm
                    </Button>
                  </div>
                )}
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
        <WalletConnectWrapper>
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
        </WalletConnectWrapper>
      </div>
    </main>
  );
};

export default ListingsPage;
