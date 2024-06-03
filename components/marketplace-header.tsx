"use client";

import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { MonetWorkLogo } from "./icons/monet-work-logo";
import { client } from "@/app/contract-utils";
import { createWallet } from "thirdweb/wallets";
import { Button } from "./ui/button";
import Link from "next/link";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import CreateOfferForm from "./forms/create-offer-form";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const MarketplaceHeader = () => {
  const activeAccount = useActiveAccount();
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const pathname = usePathname();

  const isRouteActive = (route: string) => {
    return pathname.includes(route);
  };

  const isMarketplaceRoute = isRouteActive("/marketplace");
  const isDashboardRoute = isRouteActive("/customer/dashboard");

  return (
    <nav className="sticky h-[70px] py-2 top-0 z-50 items-center gap-4 bg-background w-full">
      <div className="container flex justify-between items-center h-full text-sm">
        <div className="flex items-center gap-8 font-light">
          <Link
            href="/"
            className="text-typography-white64 hover:text-typography-white"
          >
            <MonetWorkLogo className="w-28" />
          </Link>
          <Link
            href={"/customer/dashboard"}
            className={clsx("text-muted-foreground hover:text-primary", {
              "text-primary": isDashboardRoute,
            })}
          >
            Dashboard
          </Link>
          <Link
            href={"/marketplace"}
            className={clsx("text-muted-foreground hover:text-primary", {
              "text-primary": isMarketplaceRoute,
            })}
          >
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
            <Button onClick={() => setShowOfferDialog(true)}>
              Create Offer
            </Button>
          ) : null}

          <Dialog open={showOfferDialog} onOpenChange={setShowOfferDialog}>
            <DialogContent>
              <CreateOfferForm onCanceled={() => setShowOfferDialog(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </nav>
  );
};

export default MarketplaceHeader;
