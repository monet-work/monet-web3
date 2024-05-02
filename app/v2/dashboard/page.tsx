'use client';

import { useCompanyStore } from "@/store/companyStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const DashboardPage = () => {
  const companyStore = useCompanyStore();
  const router = useRouter();

  useEffect(() => {
    if (!companyStore.company) {
      router.push("/v2");
    }
  }, []);
  return (
    <>
      <main className="min-h-screen bg-black text-white">
        <section className="container h-[400px] flex justify-center flex-col items-center">
          <h1 className="text-4xl">Welcome to Dashboard</h1>

          <div className="mt-4 border-2 rounded border-slate-200 p-4">
            <p>Company Name: {companyStore.company?.name || companyStore.company?.user?.name}</p>
            <p>Company Email: {companyStore.company?.user?.email}</p>
            <p>Company Wallet Approved?: {String(companyStore.company?.user?.isWalletApproved)}</p>
            <p>Company Email Approved?: {String(companyStore.company?.user?.isEmailApproved)}</p>
            <p>Company Approved?: {String(companyStore.company?.approved)}</p>
          </div>
        </section>
      </main>
    </>
  );
};

export default DashboardPage;
