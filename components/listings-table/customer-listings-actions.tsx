"use client";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiService } from "@/services/api.service";
import { Address } from "thirdweb";

type Props = {
  WalletAddress: Address;
};

const CustomerListingSync: React.FC<Props> = ({ WalletAddress }) => {
  const syncApiMutation = useMutation({
    mutationFn: apiService.syncCustomerPoints,
  });
  const handleSyncCustomerPoints = () => {
    syncApiMutation.mutate(WalletAddress, {
      onSuccess: () => {
        toast.success("Points synced successfully");
      },
      onError: () => {
        toast.error("Failed to sync");
      },
    });
  };

  return (
    <Button
      loading={syncApiMutation.isPending}
      className=""
      onClick={handleSyncCustomerPoints}
    >
      Sync Points
    </Button>
  );
};

export default CustomerListingSync;
