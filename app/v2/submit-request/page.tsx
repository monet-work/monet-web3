"use client";

import CompanyRequestForm from "@/components/forms/company-request-form";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/v2/navbar";
import { createCompany } from "@/lib/api-requests";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useActiveAccount } from "thirdweb/react";

const SubmitRequestPage = () => {
  const activeAccount = useActiveAccount();
  const walletAddress = activeAccount?.address;

  const router = useRouter();

  const submitRequestMutation = useMutation({
    mutationFn: createCompany,
  });

  return (
    <>
      <Navbar />
      <main className="py-16 bg-black text-white min-h-screen">
        <section className="container pt-16">
          <Card className="max-w-md bg-slate-100 shadow-md mx-auto p-4">
            <h2 className="font-semibold mb-4">Submit Request</h2>

            <CompanyRequestForm
              loading={submitRequestMutation.isPending}
              onSubmitForm={(data) => {
                if (!walletAddress) {
                  return toast.error("Wallet address not found");
                }
                submitRequestMutation.mutate(
                  {
                    walletAddress: walletAddress,
                    name: data.name,
                    email: data.email,
                  },
                  {
                    onSuccess: () => {
                      toast.success("Request submitted");
                      router.push("/v2/dashboard");
                    },
                    onError: () => {
                      toast.error("Failed to submit request");
                    },
                  }
                );
              }}
            />
          </Card>
        </section>
      </main>
    </>
  );
};

export default SubmitRequestPage;
