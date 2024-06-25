"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import { apiService } from "@/services/api.service";
import useCustomerStore from "@/store/customerStore";
import { toast } from "sonner";
import { PreparedTransaction, prepareContractCall } from "thirdweb";
import { useSendAndConfirmTransaction } from "thirdweb/react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import RedeemPointsForm from "./forms/redeem-points-form";
import { Point } from "@/models/point.model";
import { monetPointsContractFactory } from "@/app/contract-utils";
import { ExternalLink } from "lucide-react";
import SadEmoji from "./icons/sad-emoji";
import { realisticConfetti } from "@/lib/confetti-helper";
import OverlayMessageBox from "./overlay-message-box";
import { useRouter } from "next/navigation";
import PointCard from "./point-card";

const CustomerDashboard = () => {
  const router = useRouter();
  const customerStore = useCustomerStore();
  const [showRedeemForm, setShowRedeemForm] = useState(false);
  const [redeemCompletionOverlay, setRedeemCompletionOverlay] = useState({
    shouldShowRedeemCompletionOverlay: false,
    children: <></>,
  });
  const [activePointToRedeem, setActivePointToRedeem] = useState<Point | null>(
    null,
  );
  const [onChainPoints, setOnChainPoints] = useState(0);
  const [dataWithOnChainPoints, setDataWithOnChainPoints] = useState<
    any | null
  >(null);

  const {
    data: customerOnChainPointsResponse,
    isLoading: isLoadingCustomerOnChainPoints,
    isError: isErrorCustomerOnChainPoints,
    refetch: refetchCustomerPoints,
  } = useQuery({
    queryKey: [
      "customer/onChainPoints",
      { customerId: customerStore?.customer?.id },
    ],
    queryFn: () => {
      return apiService.getCustomerOnChainPoints(
        customerStore?.customer?.id!,
        activePointToRedeem?.company?.point_contract_address!,
      );
    },
    enabled:
      !!customerStore?.customer?.id &&
      !!activePointToRedeem?.company?.point_contract_address,
  });

  const redeemPointsMutation = useMutation({
    mutationFn: apiService.customerRedeemPoints,
  });

  const {
    data: customerPointsResponse,
    isLoading: isLoadingCustomerPoints,
    isError: isErrorCustomerPoints,
  } = useQuery({
    queryKey: ["customer/points", { customerId: customerStore?.customer?.id }],
    queryFn: () => {
      return apiService.fetchCustomerPoints(customerStore?.customer?.id!);
    },
    enabled: !!customerStore?.customer?.id,
  });

  const {
    mutate: sendTransaction,
    isPending,
    isError,
  } = useSendAndConfirmTransaction();

  const fetchOnChainPointsForAllTokens = async () => {
    if (customerPointsResponse?.data) {
      const { points } = customerPointsResponse.data;
      if (points.length === 0) return;
      const dataWithOnChainPoints = await Promise.all(
        points.map(async (point) => {
          const onChainPoints = await apiService.getCustomerOnChainPoints(
            customerStore?.customer?.id!,
            point.company!.point_contract_address!,
          );
          return {
            ...point,
            onChainPoints: onChainPoints.data.points,
          };
        }),
      );

      setDataWithOnChainPoints(dataWithOnChainPoints as any);
    }
  };

  useEffect(() => {
    fetchOnChainPointsForAllTokens();
  }, [customerPointsResponse]);

  const processRedeemPoints = async (point: Point) => {
    const { company_id, points, company } = point;
    if (!customerStore.customer) return;
    if (!company) return;
    const { point_contract_address } = company;
    redeemPointsMutation.mutate(
      {
        companyId: company_id,
        customerId: customerStore.customer?.id,
        amount: String(points),
      },
      {
        onSuccess: async (response) => {
          const {
            amount,
            signature,
            canRedeem,
            offChainPoints,
            onchainPoints,
          } = response.data.data;

          console.log(response.data.data, "response.data.data");

          //prepare transaction

          if (canRedeem) {
            const call = async () => {
              const transaction = await prepareContractCall({
                contract: monetPointsContractFactory(point_contract_address),
                method: "mint",
                params: [BigInt(amount), signature as any],
              });

              await sendTransaction(transaction as PreparedTransaction, {
                onSuccess: async (result) => {
                  console.log(result);
                  toast.success(points + " points redeemed successfully");
                  realisticConfetti();
                  setShowRedeemForm(false);
                  setRedeemCompletionOverlay({
                    shouldShowRedeemCompletionOverlay: true,
                    children: (
                      <div>
                        <div>
                          {"+" +
                            points +
                            " on-chain " +
                            point.company?.point_symbol +
                            " 🤑 available"}
                        </div>
                        <div>
                          Trade now at{" "}
                          <Button
                            variant={"outline"}
                            onClick={() => {
                              const urlEncodedPointName = encodeURIComponent(
                                `${point.company?.point_name}-${point_contract_address}`,
                              );
                              router.push(
                                `/marketplace/${urlEncodedPointName}`,
                              );
                            }}
                          >
                            Marketplace 🚀
                          </Button>
                        </div>
                        <div className="text-xs mt-1 text-muted-foreground">
                          View your transaction:
                          <a
                            href={`https://sepolia.basescan.org/tx/${result.transactionHash}`}
                            target="_blank"
                            className="flex items-center gap-1 hover:underline"
                          >
                            {result.transactionHash}
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    ),
                  });
                  //refetch points
                  refetchCustomerPoints();
                  await fetchOnChainPointsForAllTokens();
                },

                onError: (error) => {
                  toast.error(error.message);
                },
              });
            };

            call();
          }
        },

        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  };

  useEffect(() => {
    if (isErrorCustomerOnChainPoints) {
      toast.error("Failed to fetch customer on-chain points");
    }

    if (customerOnChainPointsResponse?.data) {
      setOnChainPoints(
        customerOnChainPointsResponse?.data.points as unknown as number,
      );
    }
  }, [customerOnChainPointsResponse]);

  const handleRedeemPoints = async (point: Point) => {
    setActivePointToRedeem(point);
    setShowRedeemForm(true);
  };

  return (
    <main className="bg-background min-h-screen">
      <div className="container py-16">
        <div className="w-full">
          <h2 className="">Your points archive</h2>
          <div className="h-full min-h-[400px] mt-4">
            {isLoadingCustomerPoints && (
              <Skeleton className="w-full h-[100px]" />
            )}

            {customerPointsResponse?.data &&
            !(customerPointsResponse?.data.points.length > 0) ? (
              <div className="text-center min-h-[400px] flex justify-center items-center border rounded-md border-muted">
                <div className="flex flex-col gap-4 items-center bg-gray-900 rounded-lg p-16">
                  <SadEmoji className=" w-16 h-16" />
                  <span className="text-muted-foreground text-lg">
                    {`Oh no! you don't seem to have any off-chain points`}
                  </span>
                </div>
              </div>
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {customerPointsResponse?.data &&
              dataWithOnChainPoints &&
              dataWithOnChainPoints.length > 0
                ? dataWithOnChainPoints?.map((point: any) => (
                    <PointCard
                      key={point.id}
                      pointName={point.company?.point_name}
                      pointSymbol={point.company?.point_symbol}
                      pointAddress={point?.company?.point_contract_address}
                      offChain={point.points}
                      onChain={point.onChainPoints}
                      onRedeemClick={() => handleRedeemPoints(point)}
                    />
                  ))
                : customerPointsResponse?.data?.points.map((point) => (
                    <PointCard
                      key={point.id}
                      pointName={point.company?.point_name || ""}
                      pointSymbol={point.company?.point_symbol || ""}
                      pointAddress={
                        point?.company?.point_contract_address || ""
                      }
                      offChain={BigInt(point.points)}
                      onChain={BigInt(0)}
                      onRedeemClick={() => handleRedeemPoints(point)}
                    />
                  ))}
            </div>
          </div>
        </div>
      </div>
      {redeemCompletionOverlay.shouldShowRedeemCompletionOverlay && (
        <OverlayMessageBox
          showCloseButton={true}
          onClose={() =>
            setRedeemCompletionOverlay({
              ...redeemCompletionOverlay,
              shouldShowRedeemCompletionOverlay: false,
            })
          }
          closeOnBackdropClick={false}
          closeOnEscapeKey={true}
        >
          {redeemCompletionOverlay.children}
        </OverlayMessageBox>
      )}
      <Dialog
        open={showRedeemForm}
        onOpenChange={(open) => setShowRedeemForm(open)}
      >
        <DialogContent>
          <div className="p-8">
            <h1 className="text-2xl font-bold text-center">Redeem Points</h1>
            <RedeemPointsForm
              totalPoints={activePointToRedeem ? activePointToRedeem.points : 0}
              onChainPoints={onChainPoints}
              isLoading={isLoadingCustomerOnChainPoints}
              isButtonLoading={isPending || redeemPointsMutation.isPending}
              onSubmitForm={(values) => {
                const { amount } = values;

                if (activePointToRedeem && activePointToRedeem.company) {
                  processRedeemPoints({
                    ...activePointToRedeem,
                    points: Number(amount),
                  });
                }
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default CustomerDashboard;
