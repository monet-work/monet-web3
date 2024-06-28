"use client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { prepareContractCall, PreparedTransaction } from "thirdweb";
import { monetMarketplaceContract } from "@/app/contract-utils";
import { useSendAndConfirmTransaction } from "thirdweb/react";
import { X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useMarketPlaceStore } from "@/store/marketPlaceStore";

type Props = {
  Id: number;
};

const UserListingsAction: React.FC<Props> = ({ Id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    mutate: sendTransaction,
    isPending,
    isError,
  } = useSendAndConfirmTransaction();
  const marketplaceStore = useMarketPlaceStore();
  const handleCancel = async () => {
    const call = async () => {
      const transaction = await prepareContractCall({
        contract: monetMarketplaceContract,
        method: "cancelListing",
        params: [BigInt(Id)],
      });

      await sendTransaction(transaction as PreparedTransaction, {
        onSuccess: (result) => {
          toast.success("Listing cancelled successfully.");
          console.log(result);
          setIsOpen(false);
          marketplaceStore.setListingCancelled(true);
        },

        onError: (error) => {
          console.log(error);
          toast.error("Error cancelling listing. Please try again later.");
          setIsOpen(false);
        },
      });
    };
    await call();
  };

  return (
    <div className="flex gap-4">
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>
          <X size={20} />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you absolutely sure you want to cancel?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently cancel your
              listing from the marketplace.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button loading={isPending} onClick={handleCancel}>
              Continue
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserListingsAction;
