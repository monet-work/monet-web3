"use client";

import { useCustomerStore } from "@/store/customerStore";
import { useState } from "react";
import { toast } from "sonner";
import {
  prepareContractCall,
  toUnits,
  PreparedTransaction,
  readContract,
  toWei,
} from "thirdweb";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import LoadingMessage from "./loading-message";
import { BackgroundGradient } from "./ui/background-gradient";
import { Button } from "./ui/button";
import WalletConnectWrapper from "./wallet-connect-wrapper";
import {
  airdropContract,
  eigenLayerTokenContract,
  elpContract,
} from "@/app/thirdweb";
import { Dialog, DialogContent } from "./ui/dialog";

type CLAIM_AIRDROP_STATE = "PENDING" | "CLAIMING" | "CLAIMED";

const ClaimAirdrop = () => {
  const account = useActiveAccount();
  const wallet = account?.address;
  const { onChainPoints, customer } = useCustomerStore();
  const [showDialog, setShowDialog] = useState(false);
  const [airdropState, setAirdropState] =
    useState<CLAIM_AIRDROP_STATE>("PENDING");

  const fetchEigenLayerTokens = async () => {
    if (!wallet) return;
    const data = await readContract({
      contract: eigenLayerTokenContract,
      method: "balanceOf",
      params: [wallet],
    });
    return data;
  };

  const {
    mutate: sendApproveTransaction,
    isPending: isApprovalPending,
    isError: isErrorApproving,
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
        setAirdropState("CLAIMING");
      },
      onError: () => {
        console.log("Error approving");
      },
    });
  };

  const {
    mutate: sendClaimAirdropTransaction,
    isError,
    isPending,
  } = useSendTransaction();

  const callClaimAirdrop = async () => {
    if (!onChainPoints) return;
    console.log("Claiming airdrop", onChainPoints, toUnits(onChainPoints, 4));
    const transaction = await prepareContractCall({
      contract: airdropContract,
      method: "exchangeTokens",
      params: [toUnits(onChainPoints, 4)],
    });
    await sendClaimAirdropTransaction(transaction as PreparedTransaction, {
      onSuccess: () => {
        setAirdropState("CLAIMED");
        setShowDialog(false);
        toast.message("Airdrop claimed successfully", {
          description: "Your airdrop has been claimed successfully",
        });
      },
      onError: (error) => {
        console.error(error);
      },
    });
  };

  const handleClaimAirdrop = async () => {
    await callClaimAirdrop();
  };

  return (
    <div>
      <div className="container py-16">
        <div className="p-4">
          <WalletConnectWrapper>
            {onChainPoints ? (
              <div className="text-center">
                <p>You are eligible for the airdrop!</p>
                <p>
                  You have <span className="font-bold">{onChainPoints}</span>{" "}
                  $ELP
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p>
                  You are not eligible for the airdrop. Please redeem your
                  points to be eligible.
                </p>
              </div>
            )}
          </WalletConnectWrapper>
        </div>

        {onChainPoints && (
          <div className="text-center mt-16 max-w-lg mx-auto">
            {/* allow user to claim airdrop */}
            <BackgroundGradient className="rounded-[22px] bg-black h-full relative overflow-hidden">
              <Button
                className="w-full"
                loading={isPending}
                disabled={isApprovalPending || airdropState === "CLAIMED"}
                onClick={() => {
                  setShowDialog(true);
                  performApproval(airdropContract.address, onChainPoints!);
                }}
              >
                Claim Airdrop
              </Button>
            </BackgroundGradient>
          </div>
        )}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <div>
            {airdropState === "PENDING" && (
              <LoadingMessage message="Approving the contract to claim airdrop" />
            )}

            {airdropState === "CLAIMING" && (
              <div>
                <p>You are going to claim the airdrop of {onChainPoints} ELP</p>
                <Button
                  className="mt-4 mx-auto"
                  onClick={() => handleClaimAirdrop()}
                >
                  Confirm
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClaimAirdrop;
