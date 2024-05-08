"use client";

import { ConnectButton, client } from "@/app/thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";

const Navbar = () => {
  const account = useActiveAccount();

  return (
    <nav className="h-[70px] sticky top-0 bg-primary w-full z-50">
      <div className="flex justify-between items-center h-full px-4 container text-sm">
        <div className="flex gap-8 items-center">
          <a
            href="/"
            className="text-typography-white64 hover:text-typography-white text-lg"
          >
            Monet
          </a>
        </div>
        <div className="flex items-center gap-8">
          {account ? (
            <ConnectButton
              client={client}
              connectButton={{
                style: {
                  padding: "0.5rem 1rem",
                },
              }}
              wallets={[createWallet("io.metamask")]}
            />
          ) : null}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
