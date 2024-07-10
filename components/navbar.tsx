"use client";

import { ConnectButton, client } from "@/app/contract-utils";
import { createWallet } from "thirdweb/wallets";
import { MonetWorkLogo } from "./icons/monet-work-logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const pathname = usePathname();
  const isRouteActive = (route: string) => {
    return pathname.includes(route);
  };

  const isMarketplaceRoute = isRouteActive("/marketplace");
  const isDashboardRoute = isRouteActive("/customer/dashboard");
  return (
    <nav className="h-[70px] sticky top-0 bg-background w-full z-50">
      <div className="flex justify-between items-center h-full container text-sm">
        <div className="flex gap-8 items-center">
          <Link
            href="/"
            className="text-typography-white64 hover:text-typography-white"
          >
            <MonetWorkLogo className="w-28" />
          </Link>
          <Link
            href={"/customer/dashboard"}
            className={cn("text-muted-foreground hover:text-primary", {
              "text-primary": isDashboardRoute,
            })}
          >
            Dashboard
          </Link>
          <Link
            href={"/marketplace"}
            className={cn("text-muted-foreground hover:text-primary", {
              "text-primary": isMarketplaceRoute,
            })}
          >
            Marketplace
          </Link>
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
