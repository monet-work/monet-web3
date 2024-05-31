import { client } from "@/app/contract-utils";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { useQuery } from "@tanstack/react-query";
import { MonetWorkLogo } from "./icons/monet-work-logo";
import { apiService } from "@/services/api.service";
import CompanyList from "./company-list";

type Props = {};

const AdminDashboard: React.FC<Props> = () => {
  const activeAccount = useActiveAccount();
  const walletAddress = activeAccount?.address;

  const { data: dashboardDataResponse, isLoading } = useQuery({
    queryKey: [],
    queryFn: () => {
      return apiService.fetchAdminCompanies();
    },
    enabled: !!walletAddress,
  });
  console.log(dashboardDataResponse, isLoading);

  return (
    <>
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
      <main className="bg-background">
        <div className="container">
          <div className="py-4">
            {dashboardDataResponse && (
              <CompanyList
                companies={dashboardDataResponse?.data.companies}
                loading={isLoading}
              />
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminDashboard;
