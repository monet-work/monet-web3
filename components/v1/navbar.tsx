"use client";

import { ConnectButton, client } from "@/app/thirdweb";
import { createWallet } from "thirdweb/wallets";

const Navbar = () => {
  return (
    <nav className="h-[70px] sticky top-0 bg-black w-full z-50">
      <div className="flex justify-between items-center h-full px-4 container text-sm">
        <div className="flex gap-8 items-center">
          <a href="/" className="text-typography-white64 hover:text-typography-white">
            Monet
          </a>
          <a href="/v1/listings" className="relative text-typography-white64 hover:text-typography-white">
            Marketplace
          </a>
          <a href="/v1/airdrop" className="relative text-typography-white64 hover:text-typography-white">
            Airdrop
          </a>
          <a href="/v2" className="relative text-typography-white64 hover:text-typography-white">
            Onboarding
            <span className="absolute flex h-3 w-3 -right-3 -top-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
            </span>
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
