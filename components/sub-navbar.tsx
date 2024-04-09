"use client";

import { elpContract } from "@/app/thirdweb";
import { useCustomerStore } from "@/store/customerStore";
import { useGlitch } from "react-powerglitch";
import { prepareContractCall, toWei } from "thirdweb";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { Button } from "./ui/button";
import { useEffect } from "react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { redeemPoints } from "@/lib/api-requests";

const transferFee = toWei("0.001");

const SubNavbar = () => {
  const glitch = useGlitch({
    playMode: "hover",
    createContainers: true,
    hideOverflow: false,
    timing: {
      duration: 2000,
    },
    glitchTimeSpan: {
      start: 0.5,
      end: 0.7,
    },
    shake: {
      velocity: 15,
      amplitudeX: 0.2,
      amplitudeY: 0.2,
    },
    slice: {
      count: 6,
      velocity: 15,
      minHeight: 0.02,
      maxHeight: 0.15,
      hueRotate: true,
    },
    pulse: false,
  });

  const {
    data: sendTransactionData,
    mutate: sendRedeemPointsTransaction,
    isError,
    isPending,
    isSuccess,
    error,
  } = useSendTransaction();

  const redeemPointsMutationFn = useMutation({
    mutationFn: redeemPoints,
  });

  const account = useActiveAccount();
  const walletAddress = account?.address;

  const handleRedeemPoints = async () => {
    const transaction = await prepareContractCall({
      contract: elpContract,
      method: "OrderYourTokens",
      value: transferFee,
      params: [],
    });
    await sendRedeemPointsTransaction(transaction as any);
  };
  const customerStore = useCustomerStore();

  useEffect(() => {
    if (isError) {
      toast.message("Transaction failed", {
        description: error?.message,
      });
    }
  }, [isError]);

  useEffect(() => {
    if (isSuccess) {
      toast.message("Transaction successful", {
        description:
          "Your points have been redeemed successfully. It will be reflected in your wallet soon.",
      });
    }
  }, [isSuccess]);

  useEffect(() => {
    if (sendTransactionData) {
      if (!walletAddress) {
        toast.message("Wallet address not found", {
          description: "Please connect your wallet to redeem points",
        });
        return;
      }
      redeemPointsMutationFn.mutate(walletAddress, {
        onSuccess: (res) => {
          customerStore.setCustomer(res.data);
          toast.message("Points redeemed successfully", {
            description:
              "Your on-chain points have been redeemed successfully. It will be reflected in your wallet soon.",
          });

          // reloading the page as a temporary fix to update the on chain points. Ideally, thirdweb events needs to be listened and acted upon
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        },
        onError: (error) => {
          console.error(error);
          toast.message("Transaction failed", {
            description: error?.message,
          });
        },
      });
    }
  }, [sendTransactionData]);

  return (
    <>
      {customerStore.customer ? (
        <div className="sticky top-[70px] z-30 px-8 py-2 bg-teal-700 text-white flex justify-end">
          <div className="flex gap-4 text-slate-200 text-sm items-center">
            <div className="flex gap-4">
              <span>Your points:</span>
              <span>
                Off-Chain:{" "}
                <span className="font-bold text-white">
                  {customerStore?.customer?.points || 0}
                </span>
              </span>
              <span>
                On-Chain:{" "}
                <span className="font-bold text-white">
                  {customerStore?.onChainPoints || 0} $ELP
                </span>
              </span>
            </div>
            {Number(customerStore?.customer?.points) > 0 ? (
              <Button
                onClick={handleRedeemPoints}
                className="text-sm bg-teal-900"
                loading={isPending}
                ref={glitch.ref}
              >
                Redeem
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default SubNavbar;
