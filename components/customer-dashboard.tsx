"use client";

import { getCustomerPoints } from "@/lib/api-requests";
import { useQuery } from "@tanstack/react-query";
import { useActiveAccount } from "thirdweb/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "./ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "./ui/button";

const CustomerDashboard = () => {
  const activeAccount = useActiveAccount();
  const walletAddress = activeAccount?.address;
  const {
    data: customerPointsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["customers/points", { walletAddress: walletAddress }],
    queryFn: () => {
      return getCustomerPoints(walletAddress!);
    },
    enabled: !!walletAddress,
  });

  return (
    <div>
      <div className="container py-16">
        <Card>
          <CardHeader>
            <CardTitle>Your collected points</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-8">
            <Tabs defaultValue="offchain" className="">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="offchain">Off-Chain</TabsTrigger>
                <TabsTrigger value="onchain">On-Chain</TabsTrigger>
              </TabsList>
              <TabsContent value="offchain">
                {isLoading && <Skeleton className="w-full h-[100px]" />}

                {customerPointsResponse?.data &&
                  customerPointsResponse?.data?.map((point) => (
                    <div
                      key={point.id}
                      className="flex items-center justify-between"
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
                              {point?.company?.pointName} (
                              {point?.company?.pointSymbol})
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-4 items-center">
                        <div className="text-lg font-semibold">
                          {point?.value}
                        </div>
                        <Button>Transfer</Button>
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
  );
};

export default CustomerDashboard;
