import { monetPointsContractFactory } from "@/app/contract-utils";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  readContract,
  prepareContractCall,
  PreparedTransaction,
} from "thirdweb";
import { useSendAndConfirmTransaction } from "thirdweb/react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

type Props = {
  contract?: {
    address: string | undefined | null;
    name: string | undefined | null;
    symbol: string | undefined | null;
  };
  isApproved?: boolean;
};

const PointContractInfo: React.FC<Props> = ({ contract, isApproved }) => {
  const { address, name, symbol } = contract ?? {};

  const [mintStatus, setMintStatus] = useState<Boolean | null>(null);

  const getMintStatus = async () => {
    if (!address) return;
    const data = await readContract({
      contract: monetPointsContractFactory(address),
      method: "mintingSwitch",
      params: [],
    });
    console.log(data, "mint status");
    setMintStatus(data);
  };

  useEffect(() => {
    getMintStatus();
  }, [address]);

  const { mutate: sendTransaction, isPending, isError } = useSendAndConfirmTransaction();
  const handleMintSwitchClick = async () => {
    const call = async () => {
      if (!address) return;
      if (mintStatus === null) return;
      const transaction = await prepareContractCall({
        contract: monetPointsContractFactory(address),
        method: "setMintingSwitch",
        params: [!mintStatus],
      });

      await sendTransaction(transaction as PreparedTransaction, {
        onSuccess: (result) => {
          toast.success("Minting Switched successfully");
          console.log(result);
        },

        onError: (error) => {
          console.log(error);
          toast.error(
            "Error while switching minting status. Please try again later."
          );
        },
      });
    };
    await call();
  };

  return (
    <div>
      <Card className="sm:col-span-2 w-fit">
        {isApproved ? (
          <>
            <CardHeader className="pb-3">
              <CardTitle>Your Points Contract</CardTitle>
              <CardDescription className="text-xs leading-relaxed max-w-sm lg:max-w-lg">
                {contract ? (
                  <span>
                    This is the contract that manages your points. It is unique
                    to your account and is used to mint, transfer, and burn
                    points.
                  </span>
                ) : (
                  <span>
                    Your request to create a points contract is pending. You
                    will be able to access your dashboard once the contract is
                    created.
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 w-full h-auto">
              {contract ? (
                <div className="text-xs">
                  <div className="flex gap-4">
                    <span className="w-[50px]">Address:</span>{" "}
                    <span className="font-semibold">
                      <a
                        href={`https://etherscan.io/address/${address}`}
                        target="_blank"
                        className="text-primary hover:underline"
                      >
                        {/* trim address with ellipsis */}
                        {address?.slice(0, 6)}...{address?.slice(-4)}
                      </a>
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 mt-1">
                    <div className="flex gap-4">
                      <span className="w-[50px]">Name:</span>{" "}
                      <span className="font-semibold">{name}</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="w-[50px]">Symbol:</span>{" "}
                      <span className="font-semibold">{symbol}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <Button
                        disabled={mintStatus === null}
                        onClick={() => handleMintSwitchClick()}
                        loading={isPending}
                      >
                        {mintStatus ? "Turn off minting" : "Turn on minting"}
                      </Button>
                      <div className="flex text-base ">
                        {mintStatus !== null && mintStatus ? (
                          <p className="text-green-500">Minting is enabled</p>
                        ) : (
                          <p className="text-red-500">Minting is disabled</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <p>Contract creation pending</p>
                </div>
              )}
            </CardContent>
          </>
        ) : (
          <CardContent className="text-sm h-40 flex items-center justify-center">
            You will be able to access your dashboard once your account is
            approved by Monet.
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default PointContractInfo;
