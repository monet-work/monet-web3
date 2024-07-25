import { client } from "@/app/contract-utils";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { useQuery } from "@tanstack/react-query";
import { MonetWorkLogo } from "./icons/monet-work-logo";
import { apiService } from "@/services/api.service";
import CompanyList from "./company-list";
import { usePathname } from "next/navigation";

type Props = {};

const AdminDashboard: React.FC<Props> = () => {
  const activeAccount = useActiveAccount();
  const walletAddress = activeAccount?.address;
  const pathName = usePathname();
  console.log(pathName);

  const { data: dashboardDataResponse, isLoading } = useQuery({
    queryKey: [],
    queryFn: () => {
      return apiService.fetchAdminCompanies();
    },
    enabled: !!walletAddress,
  });
  // console.log(dashboardDataResponse, isLoading);

  return (
    <>
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
