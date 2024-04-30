"use client";

import { Company, User } from "@/xata";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table/data-table-column-header";
import { Switch } from "./ui/switch";

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
    accessorKey: "user",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Wallet Address" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-[200px]">
          {row.getValue<User>("user")?.walletAddress}
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
        <Switch
          checked={row.getValue("approved")}
          onCheckedChange={(value) => console.log("Switched", value)}
          disabled
          aria-readonly
        />
      </div>
    ),
  },
];
