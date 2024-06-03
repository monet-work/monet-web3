"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table/data-table-column-header";
import { ListingStatus } from "@/models/listing";

export const PointsListColumns: ColumnDef<{
  name: string;
  symbol: string;
  address: string;
  status: number;
}>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px] cursor-pointer">{row.getValue("name")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "symbol",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Symbol" />
    ),
    cell: ({ row }) => <div className="">{row.getValue("symbol")}</div>,
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col">{row.getValue("address")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <div className="">
        {row.getValue("status") === ListingStatus.LIVE ? (
          <span className="text-green-500">Live</span>
        ) : row.getValue("status") === ListingStatus.BOUGHT ? (
          <span className="text-red-500">Bought</span>
        ) : (
          <span className="text-yellow-500">Cancelled</span>
        )}
      </div>
    ),
  },
];
