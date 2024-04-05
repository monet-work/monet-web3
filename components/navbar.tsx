"use client";

import { ConnectButton, client, elpContract } from "@/app/thirdweb";
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
          <ConnectButton
            client={client}
            wallets={[createWallet("io.metamask")]}
            onConnect={handleConnectWallet}
          />
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
