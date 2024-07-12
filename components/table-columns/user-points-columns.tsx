"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table/data-table-column-header";
import { CustomerPoint } from "@/models/point.model";
import UserPointsDelete from "../listings-table/user-points-delete";

export const UserPointsColumns: ColumnDef<{
  name: string;
  wallet_address: string;
  points: string;
}>[] = [
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
    accessorKey: "wallet_address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Wallet Address" />
    ),
    cell: ({ row }) => <div className="">{row.getValue("wallet_address")}</div>,
  },
  {
    accessorKey: "points",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Points" />
    ),
    cell: ({ row }) => <div className="">{row.getValue("points")}</div>,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Action"
        className="text-xs"
      />
    ),
    cell: ({ row }) => (
      <div className="text-xs cursor-pointer">
        {
          <UserPointsDelete
            name={row.getValue("name")}
            id={row.getValue("id")}
            points={row.getValue("points")}
            walletAddress={row.getValue("wallet_address")}
          />
        }
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
