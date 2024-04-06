"use client";

import { elpContract } from "@/app/thirdweb";
import { useCustomerStore } from "@/store/customerStore";
import { prepareContractCall, toWei } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { Button } from "./ui/button";

const transferFee = toWei("0.001");

const SubNavbar = () => {
  const {
    mutate: sendRedeemPointsTransaction,
    isError,
    isPending,
    error,
  } = useSendTransaction();

  const redeemPointsTransaction = async () => {
    const transaction = await prepareContractCall({
      contract: elpContract,
      method: "OrderYourTokens",
      value: transferFee,
      params: []
    });
    const res = await sendRedeemPointsTransaction(transaction as any);
  };

  const handleRedeemPoints = async () => {
    await redeemPointsTransaction();
  };
  const customerStore = useCustomerStore();
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
