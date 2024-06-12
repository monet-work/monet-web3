"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table/data-table-column-header";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AssetListing } from "@/models/asset-listing.model";

export const AdminListingColumns: ColumnDef<AssetListing>[] = [
  {
    accessorKey: "Id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue<number>("Id")}</div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">
        {row.getValue<number>("amount").toString()}
      </div>
    ),
  },
  {
    accessorKey: "asset",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Asset" />
    ),
    cell: ({ row }) => <div className="">{row.getValue("asset")}</div>,
  },
  {
    accessorKey: "fillType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fill Type" />
    ),
    cell: ({ row }) => (
      <div className="">
        {row.getValue("fillType") === 1 ? "Full" : "Partial"}
      </div>
    ),
  },
  {
    accessorKey: "listingType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Listing Type" />
    ),
    cell: ({ row }) => (
      <div className="">
        {row.getValue("listingType") === 1 ? "Sell" : "Buy"}
      </div>
    ),
  },
  {
    accessorKey: "owner",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Owner" />
    ),
    cell: ({ row }) => (
      <div className="w-[200px]">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              {row.getValue<string>("owner").slice(0, 6) +
                "..." +
                row.getValue<string>("owner").slice(-4)}
            </TooltipTrigger>
            <TooltipContent>
              <p className="cursor-text">{row.getValue("owner")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    ),
  },
  {
    accessorKey: "paymentToken",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment Token" />
    ),
    cell: ({ row }) => <div className="">{row.getValue("paymentToken")}</div>,
  },
  {
    accessorKey: "paymentType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment Type" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">
        {row.getValue("paymentType") === 0 ? "Native" : "ERC20"}
      </div>
    ),
  },
  {
    accessorKey: "pricePerPoint",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price Per Point" />
    ),
    cell: ({ row }) => (
      <div className="w-[200px]">
        {Number(row.getValue<number>("pricePerPoint"))}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">
        {row.getValue("status") === 0 ? "Closed" : "Live"}
      </div>
    ),
  },
  {
    accessorKey: "totalPrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Price" />
    ),
    cell: ({ row }) => (
      <div className="w-[200px]">
        {row.getValue<number>("totalPrice") && row.getValue<number>("totalPrice").toString()}
      </div>
    ),
  },
];
