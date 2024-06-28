"use client";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiService } from "@/services/api.service";
import { Address, prepareContractCall, PreparedTransaction } from "thirdweb";
import { monetMarketplaceContract } from "@/app/contract-utils";
import { useSendAndConfirmTransaction } from "thirdweb/react";
import { ListingStatus } from "@/models/listing";
import { AssetStatus } from "@/models/asset-listing.model";

type Props = {
  AssetAddress: Address;
  Status: AssetStatus;
};

const AdminRewardPointsAction: React.FC<Props> = ({ AssetAddress, Status }) => {
  const {
    mutate: sendTransaction,
    isPending,
    isError,
  } = useSendAndConfirmTransaction();
  console.log("AssetAddress", AssetAddress, "Status", Status);
  const handleAction = async () => {
    const call = async () => {
      const transaction = await prepareContractCall({
        contract: monetMarketplaceContract,
        method: "setAssetStatus",
        params: [
          AssetAddress,
          Status === AssetStatus.LIVE ? AssetStatus.DOWN : AssetStatus.LIVE,
        ],
      });

      await sendTransaction(transaction as PreparedTransaction, {
        onSuccess: (result) => {
          toast.success("Asset status changed succesfully.");
          console.log(result);
        },

        onError: (error) => {
          console.log(error);
          toast.error("Error changing the status. Please try again later.");
        },
      });
    };
    await call();
  };
  return (
    <Button loading={isPending} onClick={handleAction}>
      {Status === AssetStatus.LIVE ? "Put Down" : "Put Live"}
    </Button>
  );
};

export default AdminRewardPointsAction;
