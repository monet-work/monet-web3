"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../../data-table/data-table-column-header";

export const UserPointsColumns: ColumnDef<{name: string, wallet: string, value: string}>[] = [
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
    accessorKey: "wallet",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Wallet Address" />
    ),
    cell: ({ row }) => <div className="">{row.getValue("wallet")}</div>,
  },
  {
    accessorKey: "value",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Points" />
    ),
    cell: ({ row }) => <div className="">{row.getValue("value")}</div>,
  }
];
