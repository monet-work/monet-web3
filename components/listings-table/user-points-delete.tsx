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
import { useEffect, useState } from "react";
import { useMarketPlaceStore } from "@/store/marketPlaceStore";
import { apiService } from "@/services/api.service";
import { useMutation } from "@tanstack/react-query";

type Props = {
  name: string;
  id: string;
  points: string;
  walletAddress: string;
};

const UserPointsDelete: React.FC<Props> = ({
  name,
  id,
  points,
  walletAddress,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const deletePoints = useMutation({
    mutationFn: apiService.deleteUserPoints,
  });
  const [companyId, setCompanyId] = useState<string>("");
  console.log(companyId, "companyId");
  const getCompanyId = async () => {
    const company = JSON.parse(localStorage.getItem("company")!);
    setCompanyId(company.state.company.id);
  };

  useEffect(() => {
    getCompanyId();
  }, []);
  const handleDeletePoints = async () => {
    deletePoints.mutate(
      { pointsId: id.toString(), companyId: companyId.toString() },
      {
        onSuccess: () => {
          toast.success("Points deleted successfully.");
          setIsOpen(false);
        },
        onError: () => {
          toast.error("Error deleting points. Please try again later.");
          setIsOpen(false);
        },
      },
    );
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
              Are you sure you want to delete {name}&apos;s ({walletAddress}){" "}
              {points} off-chain points
            </AlertDialogTitle>
            <AlertDialogDescription>
              NOTE: The user might have converted some off-chain points to
              on-chain points. And possibly traded in the marketplace. Those
              actions cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              onClick={handleDeletePoints}
              loading={deletePoints.isPending}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserPointsDelete;
