"use client";

import { client } from "@/app/thirdweb";
import FloatingConnect from "@/components/floating-connect";
import { getCompanyDashboardData } from "@/lib/api-requests";
import { useQuery } from "@tanstack/react-query";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";

const CompanyDashboardPage = () => {
  const activeAccount = useActiveAccount();
  const walletAddress = activeAccount?.address;
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["companies/dashboard", { walletAddress: walletAddress }],
    queryFn: () => {
      return getCompanyDashboardData(walletAddress!);
    },
    enabled: !!walletAddress,
  });

  return (
    <main>
      <FloatingConnect />
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <div className="relative ml-auto flex-1 md:grow-0">
          {activeAccount ? (
            <div className="flex gap-4 items-center fixed top-0 right-0 m-4 z-50">
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
          ) : null}
        </div>
      </header>

    

    </main>
  );
};

export default CompanyDashboardPage;
