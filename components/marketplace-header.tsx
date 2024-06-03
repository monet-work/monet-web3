"use client";

import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { MonetWorkLogo } from "./icons/monet-work-logo";
import { client } from "@/app/contract-utils";
import { createWallet } from "thirdweb/wallets";
import { Button } from "./ui/button";
import Link from "next/link";
import CreateOfferDialog from "./create-offer-dialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import CreateOfferForm from "./forms/create-offer-form";

const MarketplaceHeader = () => {
  const activeAccount = useActiveAccount();
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  return (
    <nav className="sticky min-h-[70px] py-2 top-0 z-30 flex justify-between h-14 items-center gap-4 border-b bg-background w-full px-8">
      <div className="flex items-center gap-4">
        <Link href={"/"}>
          <MonetWorkLogo className="text-primary w-24 h-24" />
        </Link>
        <Link href={"/marketplace"} className="ml-8">
          Marketplace
        </Link>
      </div>
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
        {activeAccount ? (
          <Button onClick={() => setShowOfferDialog(true)}>Create Offer</Button>
        ) : null}

        <Dialog open={showOfferDialog} onOpenChange={setShowOfferDialog}>
          <DialogContent>
            <CreateOfferForm onCanceled={() => setShowOfferDialog(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </nav>
  );
};

export default MarketplaceHeader;
