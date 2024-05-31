import { client } from "@/app/thirdweb";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import UserPointsTable from "./users-points-table";
import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-uploader";
import FileSvgDraw from "./file-svg-draw";
import { Paperclip } from "lucide-react";
import { DropzoneOptions } from "react-dropzone";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCompanyContract, uploadCustomerData } from "@/lib/api-requests";
import { toast } from "sonner";
import { useCompanyStore } from "@/store/companyStore";
import PointContractInfo from "./point-contract-info";
import { readExcelFile } from "@/lib/file-helper";
import { formatCustomerData } from "@/lib/utils";
import { MonetWorkLogo } from "./icons/monet-work-logo";
import { apiService, fetchAdminCompanies } from "@/services/api.service";
import CompanyList from "./company-list";
import { Company } from "@/models/company.model";

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
