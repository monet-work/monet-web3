"use client";

import { ConnectButton, client } from "@/app/thirdweb";
import { createWallet } from "thirdweb/wallets";

const Navbar = () => {
  return (
    <nav className="h-[70px] sticky top-0 bg-primary w-full z-50">
      <div className="flex justify-between items-center h-full px-4">
        <div className="flex gap-4 items-center">
          <a href="/" className="text-xl text-primary-foreground">
            Monet
          </a>
          <a href="listings" className="text-primary-foreground relative">
            Marketplace
            <span className="absolute flex h-3 w-3 -right-3 -top-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
            </span>
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
