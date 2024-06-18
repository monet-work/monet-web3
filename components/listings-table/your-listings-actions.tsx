"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiService } from "@/services/api.service";
import {
  prepareContractCall,
  PreparedTransaction,
  readContract,
  sendTransaction,
} from "thirdweb";
import { client, monetMarketplaceContract } from "@/app/contract-utils";
import { useSendTransaction } from "thirdweb/react";
import { DeleteIcon, Trash2, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Dialog } from "../ui/dialog";
import { Close } from "@radix-ui/react-dialog";

type Props = {
  Id: number;
};

const YourListingsAction: React.FC<Props> = ({ Id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: sendTransaction, isPending, isError } = useSendTransaction();
  const handleCancel = async () => {
    const call = async () => {
      console.log(Id);
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
      {/* <Button onClick={handleCancel}>Cancel</Button>   */}
    </div>
  );
};

export default YourListingsAction;
