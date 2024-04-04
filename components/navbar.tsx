"use client";

import { ConnectButton, client } from "@/app/thirdweb";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@radix-ui/react-dropdown-menu";
import { createWallet } from "thirdweb/wallets";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getCustomer, login } from "@/lib/api-requests";
import { useCustomerStore } from "@/store/customerStore";
import { useEffect } from "react";
import { useActiveWallet } from "thirdweb/react";

const Navbar = () => {
  const customerStore = useCustomerStore();
  const loginUser = useMutation({
    mutationFn: login,
  });
  const wallet = useActiveWallet();
  const walletAddress = wallet?.getAccount()?.address;

  const {
    data: customerData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["customer", walletAddress],
    queryFn: async () => {
      const data = await getCustomer({
        walletAddress: walletAddress || "",
      });
      return data;
    },
    retry: 1,
    enabled: false,
  });

  useEffect(() => {
    if (!walletAddress) return;
    refetch();
  }, [walletAddress]);

  return (
    <nav className="h-[70px] sticky top-0 bg-primary w-full z-50">
      <div className="flex justify-between items-center h-full px-4">
        <div>
          <a href="#" className="text-2xl text-primary-foreground">
            A Monet Experiment
          </a>
        </div>
        <div className="flex items-center gap-8">
          <div className="text-primary-foreground">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div>
                  <label>Your Points</label>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="p-8">
                <DropdownMenuItem>
                  Off-Chain: <span className="font-bold">{customerData?.data.points || 0}</span>
                  <div>
                    <p>On-Chain: <span className="font-bold">0 $ELP</span></p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Button className="mt-4">Redeem Points</Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <ConnectButton
            client={client}
            wallets={[createWallet("io.metamask")]}
            onConnect={async (wallet) => {
              loginUser.mutate(wallet.getAccount()!.address, {
                onSuccess: (res) => {
                  console.log(res.data, "user logged in");
                  customerStore.setCustomer(res.data);
                },
                onError: (error) => {
                  console.error(error);
                },
              });
            }}
          />
          ;
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
