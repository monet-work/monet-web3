"use client";
import { client } from "@/app/contract-utils";
import { MonetWorkLogo } from "@/components/icons/monet-work-logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";

export default function Layout({ children }: { children: React.ReactNode }) {
  const activeAccount = useActiveAccount();
  const pathname = usePathname();
  return (
    <section>
      <header className="sticky min-h-[70px] py-2 top-0 z-30 flex justify-between h-14 items-center gap-4 border-b bg-background w-full px-8">
        <MonetWorkLogo className="text-primary w-24 h-24" />
        <div className="relative ml-auto">
          {activeAccount ? (
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
      </header>
      <div className="flex flex-row w-full max-w-7xl justify-center mx-auto  py-2">
        <Link
          className={`text-muted-foreground ${pathname === "/admin/dashboard" ? "text-primary" : ""} p-2 px-4 hover:text-primary duration-200  `}
          href="/admin/dashboard"
        >
          Companies
        </Link>
        <Link
          className={`text-muted-foreground ${pathname === "/admin/dashboard/customers" ? "text-primary" : ""} p-2 px-4 hover:text-primary duration-200  `}
          href="/admin/dashboard/customers"
        >
          Customers
        </Link>
        <Link
          className={`text-muted-foreground ${pathname === "/admin/dashboard/rewardpoints" ? "text-primary" : ""} p-2 px-4 hover:text-primary duration-200  `}
          href="/admin/dashboard/rewardpoints"
        >
          Reward Points
        </Link>
        <Link
          className={`text-muted-foreground ${pathname === "/admin/dashboard/listings" ? "text-primary" : ""} p-2 px-4 hover:text-primary duration-200  `}
          href="/admin/dashboard/listings"
        >
          Listings
        </Link>
      </div>
      {children}
    </section>
  );
}