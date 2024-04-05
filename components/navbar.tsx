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
} from "@radix-ui/react-dropdown-menu";
import { Wallet, createWallet } from "thirdweb/wallets";
import { useMutation } from "@tanstack/react-query";
import { createCustomer } from "@/lib/api-requests";
import { useCustomerStore } from "@/store/customerStore";

const Navbar = () => {
  const customerStore = useCustomerStore();

  const createCustomerMutation = useMutation({
    mutationFn: createCustomer
  });


  const handleConnectWallet = async (wallet: Wallet) => {
    //check if customer exists. If not then create customer
    // if customer exists then set customer in store
    const walletAddress = wallet.getAccount()?.address;
    if (!walletAddress) return;
    const customer = customerStore.customer;
    if (!customer) {
      createCustomerMutation.mutate({
        walletAddress
      }, {
        onSuccess: (res) => {
          customerStore.setCustomer(res.data);
        },
        onError: (error) => {
          console.error(error);
        },
      
      });
    } else {
      customerStore.setCustomer(customer);
    }
  }

  return (
    <nav className="h-[70px] sticky top-0 bg-primary w-full z-50">
      <div className="flex justify-between items-center h-full px-4">
        <div>
          <a href="#" className="text-2xl text-primary-foreground">
            Monet
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
                  Off-Chain: <span className="font-bold">{customerStore?.customer?.points || 0}</span>
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
            onConnect={handleConnectWallet}
          />
          ;
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
