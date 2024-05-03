"use client";

import CompanyRequestForm from "@/components/forms/company-request-form";
import { Card } from "@/components/ui/card";
import { useCompanyStore } from "@/store/companyStore";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const DashboardPage = () => {
  const userStore = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!userStore.user?.isWalletApproved) {
      router.push("/v2");
    }
  }, [userStore.user]);

  return (
    <>
      <main className="min-h-screen bg-black text-white">
        <section className="container flex justify-center flex-col items-center">
          <h1 className="text-2xl">Welcome to Dashboard</h1>

          <Card className="p-4 mt-8 max-w-md w-2/3">
            <CompanyRequestForm onSubmitForm={(values) => {}} />
          </Card>
        </section>
      </main>
    </>
  );
};

export default DashboardPage;
