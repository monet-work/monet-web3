"use client";

import { ConnectButton, client } from "@/app/thirdweb";
import { createWallet } from "thirdweb/wallets";


const Navbar = () => {
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
          />
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
