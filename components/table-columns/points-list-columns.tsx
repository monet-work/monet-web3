"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table/data-table-column-header";

export const PointsListColumns: ColumnDef<{
  token: string;
  lastPrice: string;
  vol24h: string;
  totalVol: string;
  settleStarts: string;
  settleEnds: string;
  countdown: string;
}>[] = [
  {
    accessorKey: "Token",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Token" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("Token")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "Last_Price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Price" />
    ),
    cell: ({ row }) => <div className="">{row.getValue("Last_Price")}</div>,
  },
  {
    accessorKey: "Vol_24h",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vol 24h" />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col">{row.getValue("Vol_24h")}</div>
    ),
  },
  {
    accessorKey: "Total_Vol",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Vol" />
    ),
    cell: ({ row }) => <div className="">{row.getValue("Total_Vol")}</div>,
  },
  {
    accessorKey: "Settle_Starts_UTC",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Settle Starts (UTC)" />
    ),
    cell: ({ row }) => (
      <div className="">{row.getValue("Settle_Starts_UTC")}</div>
    ),
  },
  {
    accessorKey: "Settle_Ends_UTC",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Settle Ends (UTC)" />
    ),
    cell: ({ row }) => (
      <div className="">{row.getValue("Settle_Ends_UTC")}</div>
    ),
  },
  {
    accessorKey: "Countdown",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Countdown" />
    ),
    cell: ({ row }) => <div className="">{row.getValue("Countdown")}</div>,
  },
];
