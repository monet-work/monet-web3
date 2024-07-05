"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table/data-table-column-header";
import { ListingStatus } from "@/models/listing";
import { Skeleton } from "../ui/skeleton";

export const PointsListColumns: ColumnDef<{
  name: string;
  symbol: string;
  address: string;
  status: number;
  mintedPoints?: number;
  userPoints?: number;
}>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px] cursor-pointer text-xs">
        {row.getValue("name")}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "symbol",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Symbol" />
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground text-xs">
        {row.getValue("symbol")}
      </div>
    ),
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground text-xs">
        {row.getValue("address")}
      </div>
    ),
  },
  {
    accessorKey: "mintedPoints",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Minted Points" />
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground text-xs">
        {row.getValue("mintedPoints") ||
          (row.getValue("mintedPoints") === 0 ? (
            "0"
          ) : (
            <Skeleton className="w-full h-5" />
          ))}
      </div>
    ),
  },
  {
    accessorKey: "userPoints",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="On-Chain Balance" />
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground text-xs">
        {row.getValue("userPoints") ||
          (row.getValue("userPoints") === 0 ? (
            "0"
          ) : (
            <Skeleton className="w-full h-5" />
          ))}
      </div>
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
          <span className="text-yellow-500">Down</span>
        )}
      </div>
    ),
  },
];
