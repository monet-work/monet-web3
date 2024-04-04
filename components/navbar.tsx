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
import useThirdWebStore from "@/store/thirdwebStore";

const Navbar = () => {
  const thirdwebStore = useThirdWebStore();
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
              <DropdownMenuContent className="p-4">
                <DropdownMenuItem>Off-Chain: 0</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Button>Redeem Points</Button>
                </DropdownMenuItem>
                <div>
                  <p>On-Chain: 0 $ELP</p>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <ConnectButton
            client={client}
            wallets={[createWallet("io.metamask")]}
            onConnect={async (wallet) => {
              thirdwebStore.setWalletAccount(wallet.getAccount()!);
            }}
          />
          ;
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
