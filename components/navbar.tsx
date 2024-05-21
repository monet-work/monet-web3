"use client";

import { ConnectButton, client } from "@/app/thirdweb";
import { createWallet } from "thirdweb/wallets";
import { MonetWorkLogo } from "./icons/monet-work-logo";

const Navbar = () => {
  return (
    <nav className="h-[70px] sticky top-0 bg-background w-full z-50">
      <div className="flex justify-between items-center h-full px-4 container text-sm">
        <div className="flex gap-8 items-center">
          <a href="/" className="text-typography-white64 hover:text-typography-white">
           <MonetWorkLogo className="w-28" />
          </a>
          <a href="listings" className="relative text-typography-white64 hover:text-typography-white">
            Marketplace
          </a>
        
        </div>
        <div className="flex items-center gap-8">
          <ConnectButton
            client={client}
            connectButton={{
              style: {
                padding: "0.5rem 1rem",
              },
            }}
            wallets={[createWallet("io.metamask")]}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
