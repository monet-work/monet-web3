"use client";

import AdminDashboard from "@/components/admin-dashboard";

import { useActiveAccount } from "thirdweb/react";

const AdminDashboardPage = () => {
  const activeAccount = useActiveAccount();
  const walletAddress = activeAccount?.address;

  return <AdminDashboard />;
};

export default AdminDashboardPage;
