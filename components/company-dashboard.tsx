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
import { CustomerPoint } from "@/models/point";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-uploader";
import FileSvgDraw from "./file-svg-draw";
import { LockIcon, Paperclip } from "lucide-react";
import { DropzoneOptions } from "react-dropzone";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCompanyContract, uploadCustomerData } from "@/lib/api-requests";
import { toast } from "sonner";
import CompanyRequestForm from "./forms/company-request-form";
import { useCompanyStore } from "@/store/companyStore";
import PointContractInfo from "./point-contract-info";
import { readExcelFile } from "@/lib/file-helper";
import { formatCustomerData } from "@/lib/utils";

type Props = {
  customerPoints: {name: string, wallet: string, value: string}[];
  hasContract?: boolean;
  contract?: {
    address: string;
    name: string | null | undefined;
    symbol: string | null | undefined;
  };
};

const CompanyDashboard: React.FC<Props> = ({
  customerPoints,
  hasContract = false,
  contract,
}) => {
  const companyStore = useCompanyStore();
  const queryClient = useQueryClient();
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showContractFormDialog, setShowContractFormDialog] = useState(false);
  const [files, setFiles] = useState<File[] | null>(null);
  const [customerData, setCustomerData] = useState<
    { name: string; wallet: string; value: number }[] | null
  >(null);
  const [customerPointsData, setCustomerPointsData] = useState<
    {
      name: string;
      wallet: string;
      value: string;
    }[]
  >(customerPoints);

  const activeAccount = useActiveAccount();
  const companyWalletAddress = activeAccount?.address;

  const uploadCustomerDataMutation = useMutation({
    mutationFn: uploadCustomerData,
  });

  const createCompanyContractMutation = useMutation({
    mutationFn: createCompanyContract,
  });

  const handleCustomerPointsUpload = () => {
    if (!customerData || !companyWalletAddress) return;
    uploadCustomerDataMutation.mutate(
      {
        walletAddress: companyWalletAddress,
        customerData: customerData,
      },
      {
        onSuccess: (response) => {
          const formattedData = response.data.map((item: any) => {
            return {
              name: item.owner.name,
              wallet: item.owner.walletAddress,
              value: item.value,
            };
          });
          toast.success("Customer data uploaded successfully");
          setFiles(null);
          setCustomerData(null);
          setShowUploadDialog(false);
          setCustomerPointsData({
            ...customerPointsData,
            ...formattedData,
          });
          window.location.reload(); // TODO - remove this
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data || "Failed to upload customer data"
          );
        },
      }
    );
  };

  const calculateTotalPoints = (customerPoints: {name: string, wallet: string, value: string}[]) => {
    return customerPoints.reduce((acc, item) => {
      return acc + parseInt(item.value);
    }, 0);
  };

  const handleDownloadTemplate = () => {
    const url = "/docs/offchain-points-template.xlsx";
    window.open(url, "_blank");
  };

  const dropZoneConfig: DropzoneOptions = {
    maxFiles: 1,
    maxSize: 1000000,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
  };

  useEffect(() => {
    if (!files) return;
    const chosenFile = files[0];
    const processFile = async () => {
      const data = await readExcelFile(chosenFile);
      const formattedData = formatCustomerData(data as any);
      setCustomerData(formattedData);
    };
    processFile();
  }, [files]);

  useEffect(() => {
    setCustomerPointsData(customerPoints);
  }, [
    customerPoints,
    uploadCustomerDataMutation.data
  ])


  const DisableBlockIfNoContract = ({
    children,
    disabled,
  }: {
    children: React.ReactNode;
    disabled: boolean;
  }) => {
    return (
      <div className="relative rounded">
        {disabled ? (
          <Card className="absolute w-full h-full top-0 left-0 bg-white/10 backdrop-blur-sm z-20"></Card>
        ) : null}
        {children}
      </div>
    );
  };

  return (
    <>
      <header className="sticky min-h-[70px] py-2 top-0 z-30 flex h-14 items-center gap-4 border-b bg-primary w-full">
        <div className="relative ml-auto flex-1 md:grow-0">
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

      <main className="bg-gray-100">
        <div className="container">
          <div className="py-4">
            <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <PointContractInfo
                  contract={contract}
                  onContractCreateRequested={() =>
                    setShowContractFormDialog(true)
                  }
                />
                <DisableBlockIfNoContract disabled={!hasContract}>
                  <Card className="h-full">
                    <CardHeader className="pb-2">
                      <CardDescription>Points On Chain</CardDescription>
                      <CardTitle className="text-4xl">
                        {customerPoints.length || 0}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-muted-foreground">
                        <div className="flex flex-col">
                          <span>
                            <span className="font-semibold">999 Million</span>{" "}
                            points available
                          </span>
                          <span>
                            <span className="font-semibold">2345</span> points
                            distributed
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </DisableBlockIfNoContract>

                <DisableBlockIfNoContract disabled={!hasContract}>
                  <Card className="h-full">
                    <CardHeader className="pb-2">
                      <CardDescription>Total Customers</CardDescription>
                      <CardTitle className="text-4xl">
                        {customerPoints.length || 0}
                      </CardTitle>
                    </CardHeader>
                    <CardContent></CardContent>
                  </Card>
                </DisableBlockIfNoContract>
                <DisableBlockIfNoContract disabled={!hasContract}>
                  <Card className="h-full">
                    <CardHeader className="pb-2">
                      <CardDescription>Total Off-Chain points</CardDescription>
                      <CardTitle className="text-4xl">
                        {calculateTotalPoints(customerPoints) || 0}
                      </CardTitle>
                    </CardHeader>
                    <CardContent></CardContent>
                  </Card>
                </DisableBlockIfNoContract>
              </div>

              <div>
                <DisableBlockIfNoContract disabled={!hasContract}>
                  <Card className="h-full">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between">
                        <div>
                          <CardTitle>Your Customers</CardTitle>
                          <CardDescription className="mt-2">
                            You can view all your customers here and their
                            points
                          </CardDescription>
                        </div>
                        <div>
                          <Button onClick={() => setShowUploadDialog(true)}>
                            Upload Points
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <UserPointsTable data={customerPointsData} />
                    </CardContent>
                  </Card>
                </DisableBlockIfNoContract>
              </div>
            </div>
          </div>
        </div>

        <Dialog
          open={showContractFormDialog}
          onOpenChange={setShowContractFormDialog}
        >
          <DialogContent className="bg-white">
            <CompanyRequestForm
              loading={createCompanyContractMutation.isPending}
              onSubmitForm={(values) => {
                const {
                  email,
                  name,
                  points,
                  decimalDigits,
                  orderingFee,
                  pointName,
                  pointSymbol,
                } = values;

                createCompanyContractMutation.mutate(
                  {
                    companyName: name,
                    email,
                    allPoints: points,
                    decimalDigits,
                    orderingFee: orderingFee,
                    pointsName: pointName,
                    pointsSymbol: pointSymbol,
                    walletAddress: companyWalletAddress!,
                  },
                  {
                    onSuccess: (response) => {
                      toast.success("Points contract created successfully");
                      companyStore.setCompany(response.data);
                      setShowContractFormDialog(false);
                      queryClient.invalidateQueries({
                        queryKey: ["companies/dashboard", companyWalletAddress],
                      });
                      window.location.reload();
                    },
                    onError: (error: any) => {
                      toast.error(
                        error?.response?.data ||
                          "Failed to create points contract"
                      );
                    },
                  }
                );

                if (!companyWalletAddress) return;
              }}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogContent className="bg-white">
            <div className="text-center">
              <Button className="mx-auto" onClick={handleDownloadTemplate}>
                Download Template
              </Button>
              <FileUploader
                value={files}
                onValueChange={setFiles}
                dropzoneOptions={dropZoneConfig}
                className="relative bg-white rounded-lg p-2 mt-4"
              >
                <FileInput className="outline-dashed outline-1 outline-white">
                  <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
                    <FileSvgDraw />
                  </div>
                </FileInput>
                <FileUploaderContent>
                  {files &&
                    files.length > 0 &&
                    files.map((file, i) => (
                      <FileUploaderItem key={i} index={i}>
                        <Paperclip className="h-4 w-4 stroke-current" />
                        <span>{file.name}</span>
                      </FileUploaderItem>
                    ))}
                </FileUploaderContent>
              </FileUploader>

              {files && files.length > 0 && (
                <Button
                  className="mt-4"
                  onClick={handleCustomerPointsUpload}
                  loading={uploadCustomerDataMutation.isPending}
                >
                  Upload
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
};

export default CompanyDashboard;