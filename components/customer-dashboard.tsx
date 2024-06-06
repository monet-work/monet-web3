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
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import RedeemPointsForm from "./forms/redeem-points-form";
import { Point } from "@/models/point.model";
import { monetPointsContractFactory } from "@/app/contract-utils";
import { ExternalLink } from "lucide-react";

const CustomerDashboard = () => {
  const customerStore = useCustomerStore();
  const account = useActiveAccount();
  const [showRedeemForm, setShowRedeemForm] = useState(false);
  const [activePointToRedeem, setActivePointToRedeem] = useState<Point | null>(
    null
  );
  const [onChainPoints, setOnChainPoints] = useState(0);

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
        activePointToRedeem?.company?.point_contract_address!
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

  const { mutate: sendTransaction, isPending, isError } = useSendTransaction();

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
      }
    );
  };

  useEffect(() => {
    if (isErrorCustomerOnChainPoints) {
      toast.error("Failed to fetch customer on-chain points");
    }

    if (customerOnChainPointsResponse?.data) {
      setOnChainPoints(
        customerOnChainPointsResponse?.data.points as unknown as number
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
          <div className="h-full py-4">
            {isLoadingCustomerPoints && (
              <Skeleton className="w-full h-[100px]" />
            )}

            {customerPointsResponse?.data &&
            !(customerPointsResponse?.data.points.length > 0) ? (
              <div className="text-center h-full flex justify-center items-center">
                <span>No off-chain points available</span>
              </div>
            ) : null}

            {customerPointsResponse?.data &&
              customerPointsResponse?.data?.points.map((point) => (
                <div
                  key={point.id}
                  className="flex items-center py-4 px-2 justify-between odd:bg-gray-900"
                >
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div>
                        <div className="text-lg font-semibold">
                          {point?.company?.name}
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
