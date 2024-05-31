"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "./ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "./ui/button";
import { apiService } from "@/services/api.service";
import useCustomerStore from "@/store/customerStore";
import { toast } from "sonner";

const CustomerDashboard = () => {
  const customerStore = useCustomerStore();
  const {
    data: customerPointsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["customers/points", { customerId: customerStore?.customer?.id }],
    queryFn: () => {
      return apiService.fetchCustomerPoints(customerStore?.customer?.id!);
    },
    enabled: !!customerStore?.customer?.id,
  });

  const redeemPointsMutation = useMutation({
    mutationFn: apiService.customerRedeemPoints,
  });

  const handleRedeemPoints = (
    companyId: string,
    customerId: string,
    amount: string
  ) => {
    redeemPointsMutation.mutate(
      { companyId, customerId, amount },
      {
        onSuccess: async (response) => {
          const {
            amount,
            signature,
            canRedeem,
            offChainPoints,
            onchainPoints,
          } = response.data.data;
          console.log(response);
        },

        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  return (
    <main className="bg-background min-h-screen">
      <div className="container py-16">
        <div className="w-full">
          <Card>
            <CardHeader>
              <CardTitle>Your collected points</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-8 min-h-[400px]">
              <Tabs defaultValue="offchain" className="">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="offchain">Off-Chain</TabsTrigger>
                  <TabsTrigger value="onchain">On-Chain</TabsTrigger>
                </TabsList>
                <TabsContent value="offchain" className="h-full py-4">
                  {isLoading && <Skeleton className="w-full h-[100px]" />}

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
                          </div>
                        </div>
                        <div className="flex gap-4 items-center">
                          <div className="text-lg font-semibold">
                            {point?.points}
                          </div>
                          <Button
                            variant={"outline"}
                            loading={redeemPointsMutation.isPending}
                            onClick={() =>
                              point &&
                              point.company &&
                              handleRedeemPoints(
                                point?.company?.id,
                                customerStore?.customer?.id!,
                                String(point?.points)
                              )
                            }
                          >
                            Redeem
                          </Button>
                        </div>
                      </div>
                    ))}
                </TabsContent>
                <TabsContent value="onchain">
                  <div className="py-4">
                    <p className="text-gray-500 text-center">
                      On-Chain points are not available yet.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default CustomerDashboard;
