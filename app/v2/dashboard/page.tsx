"use client";

import FileSvgDraw from "@/components/file-svg-draw";
import CompanyRequestForm from "@/components/forms/company-request-form";
import { CardBody } from "@/components/ui/3d-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-uploader";
import { Spinner } from "@/components/ui/spinner";
import PointContractInfo from "@/components/v2/point-contract-info";
import UserPointsTable from "@/components/v2/users-points-table";
import {
  createCompanyContract,
  getCompanyByWalletAddress,
  getPointsByCompanyWalletAddress,
  uploadCustomerData,
} from "@/lib/api-requests";
import { readExcelFile } from "@/lib/file-helper";
import { formatCustomerData } from "@/lib/utils";
import { useCompanyStore } from "@/store/companyStore";
import { useUserStore } from "@/store/userStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Paperclip } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DropzoneOptions } from "react-dropzone";
import { toast } from "sonner";
import { useActiveAccount } from "thirdweb/react";

const DashboardPage = () => {
  const userStore = useUserStore();
  const companyStore = useCompanyStore();
  const router = useRouter();
  const activeAccount = useActiveAccount();
  const companyWalletAddress = activeAccount?.address;
  const [showForm, setShowForm] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [files, setFiles] = useState<File[] | null>(null);
  const [customerData, setCustomerData] = useState<
    { name: string; wallet: string; value: number }[] | null
  >(null);
  const [userPointsData, setUserPointsData] = useState<
    {
      name: string;
      wallet: string;
      value: string;
    }[]
  >([]);

  useEffect(() => {
    if (!userStore.user?.isWalletApproved) {
      router.push("/v2");
    }
  }, [userStore.user]);

  const createCompanyContractMutation = useMutation({
    mutationFn: createCompanyContract,
  });

  const {
    data: companyData,
    isLoading: isCompanyLoading,
    isError: isCompanyError,
  } = useQuery({
    queryKey: ["company", { walletAddress: companyWalletAddress }],
    queryFn: () => {
      return getCompanyByWalletAddress(companyWalletAddress!);
    },
    enabled: !!companyWalletAddress,
  });

  const {
    data: pointsData,
    isLoading: isPointsDataLoading,
    isError: isPointsDataError,
  } = useQuery({
    queryKey: ["company/points", { walletAddress: companyWalletAddress }],
    queryFn: () => {
      return getPointsByCompanyWalletAddress(companyWalletAddress!);
    },
    enabled: !!companyWalletAddress,
  });

  useEffect(() => {
    if (companyData?.data) {
      companyStore.setCompany(companyData.data);
    }
    if (isCompanyError) {
      router.push("/v2");
    }
  }, [companyData, companyStore.company]);

  const currentCompany = companyStore?.company;

  useEffect(() => {
    if (currentCompany && currentCompany.pointContractAddress) {
      setShowForm(false);
    } else {
      setShowForm(true);
    }
  }, [currentCompany]);

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
    if (!pointsData) return;
    const formattedData = pointsData.data.map((item) => {
      return {
        name: item.owner.name,
        wallet: item.owner.walletAddress,
        value: String(item.value),
      };
    });
    setUserPointsData(formattedData);
  }, [pointsData]);

  const uploadCustomerDataMutation = useMutation({
    mutationFn: uploadCustomerData,
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
          setUserPointsData(formattedData);
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data || "Failed to upload customer data"
          );
        },
      }
    );
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

  return (
    <>
      <main className="min-h-screen bg-black text-white py-4">
        <section className="container">
          <h1 className="text-lg text-slate-300">Dashboard</h1>

          {isCompanyLoading ? (
            <div className="flex justify-center items-center h-[400px]">
              <Spinner size={"large"} className="text-white" />
            </div>
          ) : null}

          {currentCompany && !isCompanyLoading && !showForm ? (
            <div className="mt-4">
              <PointContractInfo
                address={currentCompany.pointContractAddress || ""}
                name={currentCompany.pointName || ""}
                symbol={currentCompany.pointSymbol || ""}
              />
              <div className="mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle>Users Points</CardTitle>
                        <CardDescription>
                          You can view all your customers here and their points
                        </CardDescription>
                      </div>
                      <div>
                        <Button onClick={() => setShowUploadDialog(true)}>
                          Upload
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody className="px-6 w-full">
                    <UserPointsTable data={userPointsData} />
                  </CardBody>
                </Card>
              </div>
            </div>
          ) : null}

          {currentCompany && showForm && !isCompanyLoading ? (
            <div className="">
              <Card className="p-4 mt-8 max-w-md w-2/3 mx-auto">
                <h3>Deploy your points contract</h3>
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
                          setShowForm(false);
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
              </Card>
            </div>
          ) : null}
        </section>

        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogContent className="bg-white">
            <div className="text-center">
              <Button
                className="mx-auto"
                onClick={handleDownloadTemplate}
                variant={"link"}
              >
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

export default DashboardPage;
