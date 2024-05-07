"use client";

import { Customer, Point, User } from "@/xata";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../../data-table/data-table-column-header";
import CompanyTableRowActions from "../../company-table/data-table-row-actions";

export const UserPointsColumns: ColumnDef<Customer>[] = [
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
    accessorKey: "points",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Points" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-[200px]">
          {row.getValue<Point>("point").value || ""}
        </div>
      );
    },
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
