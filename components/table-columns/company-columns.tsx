"use client";

import { Company, User } from "@/xata";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table/data-table-column-header";
import { Button } from "../ui/button";
import { approveCompany, rejectCompany } from "@/lib/api-requests";
import CompanyTableRowActions from "../company-table/data-table-row-actions";

export const columns: ColumnDef<Company>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("name")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "user",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-[200px]">{row.getValue<User>("user")?.email}</div>
      );
    },
  },
  {
    id: "walletAddress",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Wallet Address" />
    ),
    cell: ({ row }) => {
      return (
        <div
          className="w-[200px]"
          title={row.getValue<User>("user")?.walletAddress || ""}
        >
          {row.getValue<User>("user")?.walletAddress?.slice(0, 10) + "..."}
        </div>
      );
    },
  },
  {
    accessorKey: "approved",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Approved" />
    ),
    cell: ({ row }) => (
      <div>
        {row.getValue("approved") ? `${row.getValue("approved")}` : `Pending`}
      </div>
    ),
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => (
      <CompanyTableRowActions
        approved={row.getValue("approved") as boolean}
        companyWalletAddress={
          row.getValue<User>("user")?.walletAddress as string
        }
      />
    ),
  },
];
