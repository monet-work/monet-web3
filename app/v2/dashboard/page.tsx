"use client";

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
        <section className="container h-[400px] flex justify-center flex-col items-center">
          <h1 className="text-4xl">Welcome to Dashboard</h1>

         
        </section>
      </main>
    </>
  );
};

export default DashboardPage;
