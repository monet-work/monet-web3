"use client";

import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { MonetWorkLogo } from "./icons/monet-work-logo";
import { client } from "@/app/contract-utils";
import { createWallet } from "thirdweb/wallets";
import { Button } from "./ui/button";
import Link from "next/link";

const MarketplaceHeader = () => {
  const activeAccount = useActiveAccount();
  return (
    <nav className="sticky min-h-[70px] py-2 top-0 z-30 flex justify-between h-14 items-center gap-4 border-b bg-background w-full px-8">
      <Link href={"/"}>
        <MonetWorkLogo className="text-primary w-24 h-24" />
      </Link>
      <div className="relative flex gap-2 items-center justify-between">
        <ConnectButton
          client={client}
          connectButton={{
            style: {
              padding: "0.5rem 1rem",
            },
          }}
          wallets={[createWallet("io.metamask")]}
        />

        {activeAccount ? <Button>Create Offer</Button> : null}
      </div>
    </nav>
  );
};

export default MarketplaceHeader;
