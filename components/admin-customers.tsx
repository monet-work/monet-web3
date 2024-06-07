"use client";
import { useQuery } from "@tanstack/react-query";

import { apiService } from "@/services/api.service";
import { useActiveAccount } from "thirdweb/react";
import { DataTable } from "./data-table/data-table";
import { CustomerColumns } from "./table-columns/customers-columns";

type Props = {};

const AdminCustomers: React.FC<Props> = () => {
  const activeAccount = useActiveAccount();
  const walletAddress = activeAccount?.address;

  const { data, isLoading } = useQuery({
    queryKey: ["admin-customers"],
    queryFn: () => {
      return apiService.getAdminCustomerDetails();
    },
    enabled: !!walletAddress,
  });
  console.log(data, "customers");

  return (
    <main className="bg-background">
      <div className="container">
        <div className="py-4">
          {data && (
            <div>
              <h2 className="mb-4 font-semibold text-slate-600p">Companies</h2>
              <DataTable
                columns={CustomerColumns}
                data={data.data.customers}
                loading={isLoading}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default AdminCustomers;
