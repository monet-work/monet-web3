"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "./ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "./ui/button";
import { apiService } from "@/services/api.service";
import useCustomerStore from "@/store/customerStore";
import { toast } from "sonner";
import { PreparedTransaction, prepareContractCall } from "thirdweb";
import { useActiveAccount, useSendAndConfirmTransaction } from "thirdweb/react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import RedeemPointsForm from "./forms/redeem-points-form";
import { Point } from "@/models/point.model";
import { monetPointsContractFactory } from "@/app/contract-utils";
import { ExternalLink } from "lucide-react";
import SadEmoji from "./icons/sad-emoji";
import confetti from "canvas-confetti";
import { realisticConfetti } from "@/lib/confetti-helper";

const CustomerDashboard = () => {
  const customerStore = useCustomerStore();
  const account = useActiveAccount();
  const [showRedeemForm, setShowRedeemForm] = useState(false);
  const [activePointToRedeem, setActivePointToRedeem] = useState<Point | null>(
    null,
  );
  const [onChainPoints, setOnChainPoints] = useState(0);
  const [dataWithOnChainPoints, setDataWithOnChainPoints] = useState<
    any | null
  >(null);
  // console.log(dataWithOnChainPoints, "dataWithOnChainPoints");

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

  // console.log(customerPointsResponse, "customerPointsResponse");
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
                onSuccess: (result) => {
                  toast.success("Points redeemed successfully");
                  realisticConfetti();
                  setShowRedeemForm(false);

                  //refetch points
                  refetchCustomerPoints();
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
          <div className="h-full min-h-[400px] border rounded-md border-muted mt-4">
            {isLoadingCustomerPoints && (
              <Skeleton className="w-full h-[100px]" />
            )}

            {customerPointsResponse?.data &&
            !(customerPointsResponse?.data.points.length > 0) ? (
              <div className="text-center min-h-[400px] flex justify-center items-center">
                <div className="flex flex-col gap-4 items-center bg-gray-900 rounded-lg p-16">
                  <SadEmoji className=" w-16 h-16" />
                  <span className="text-muted-foreground text-lg">
                    {`Oh no! you don't seem to have any off-chain points`}
                  </span>
                </div>
              </div>
            ) : null}

            {customerPointsResponse?.data &&
            dataWithOnChainPoints &&
            dataWithOnChainPoints.length > 0
              ? dataWithOnChainPoints?.map((point: any) => (
                  <div
                    key={point.id}
                    className="flex items-center px-2 justify-between odd:bg-gray-900"
                  >
                    <div className="flex items-center">
                      <div className="p-4">
                        <div>
                          <div className="text-lg font-semibold">
                            {point?.company?.name ?? ""}
                          </div>
                        </div>
                        <div className="text-xs">
                          {/* point name and symbol in a single line */}
                          <span>
                            {point?.company?.point_name} (
                            {point?.company?.point_symbol})
                          </span>
                        </div>
                        <div className="text-xs mt-1 text-muted-foreground hover:underline">
                          <a
                            href={`https://sepolia.basescan.org/address/${point?.company?.point_contract_address}`}
                            target="_blank"
                            className="flex items-center gap-1"
                          >
                            {point?.company?.point_contract_address}

                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4 items-center">
                      <div className="text-lg font-semibold">
                        {point?.points} points
                      </div>
                      <div className="text-lg font-semibold">
                        {point?.onChainPoints} on-chain points
                      </div>
                      <Button
                        disabled={point?.onChainPoints > point?.points}
                        variant={"outline"}
                        loading={
                          redeemPointsMutation.isPending ||
                          isPending ||
                          isLoadingCustomerOnChainPoints
                        }
                        onClick={() => {
                          handleRedeemPoints(point);
                        }}
                      >
                        Redeem
                      </Button>
                    </div>
                  </div>
                ))
              : customerPointsResponse?.data?.points.map((point) => (
                  <div
                    key={point.id}
                    className="flex items-center px-2 justify-between odd:bg-gray-900"
                  >
                    <div className="flex items-center">
                      <div className="p-4">
                        <div>
                          <div className="text-lg font-semibold">
                            {point?.company?.name ?? ""}
                          </div>
                        </div>
                        <div className="text-xs">
                          {/* point name and symbol in a single line */}
                          <span>
                            {point?.company?.point_name} (
                            {point?.company?.point_symbol})
                          </span>
                        </div>
                        <div className="text-xs mt-1 text-muted-foreground hover:underline">
                          <a
                            href={`https://sepolia.basescan.org/address/${point?.company?.point_contract_address}`}
                            target="_blank"
                            className="flex items-center gap-1"
                          >
                            {point?.company?.point_contract_address}

                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4 items-center">
                      <div className="text-lg font-semibold">
                        {point?.points} points
                      </div>

                      <Button
                        variant={"outline"}
                        loading={
                          redeemPointsMutation.isPending ||
                          isPending ||
                          isLoadingCustomerOnChainPoints
                        }
                        onClick={() => {
                          handleRedeemPoints(point);
                        }}
                      >
                        Redeem
                      </Button>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>

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
              isButtonLoading={isPending}
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
