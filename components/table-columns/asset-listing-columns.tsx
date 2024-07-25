"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table/data-table-column-header";
import {
  AssetListing,
  ListingFillType,
  ListingType,
  PaymentType,
} from "@/models/asset-listing.model";
import clsx from "clsx";
import { ListingStatus } from "@/models/listing";

export const AssetListingColumns: ColumnDef<AssetListing>[] = [
  {
    accessorKey: "Id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" className="text-xs" />
    ),
    cell: ({ row }) => {
      return <div className="text-xs cursor-pointer">{row.getValue("Id")}</div>;
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Amount"
        className="text-xs"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-xs cursor-pointer">{row.getValue("amount")}</div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "listingType",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Listing"
        className="text-xs"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className={clsx("text-xs cursor-pointer")}>
          {row.getValue("listingType") === ListingType.BUY ? (
            <span className="text-green-500">Buy</span>
          ) : (
            <span className="text-red-500">Sell</span>
          )}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "fillType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fill" className="text-xs" />
    ),
    cell: ({ row }) => (
      <div className="text-xs cursor-pointer">
        {row.getValue("fillType") === ListingFillType.FULL ? "Full" : "Partial"}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "paymentType",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Payment"
        className="text-xs"
      />
    ),
    cell: ({ row }) => (
      <div className="text-xs cursor-pointer">
        {row.getValue("paymentType") === PaymentType.NATIVE_TOKEN
          ? "ETH"
          : "Custom"}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "owner",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Owner"
        className="text-xs"
      />
    ),
    cell: ({ row }) => (
      <div className="text-xs cursor-pointer">{row.getValue("owner")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "totalPrice",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Price"
        className="text-xs"
      />
    ),
    cell: ({ row }) => (
      <div className="text-xs cursor-pointer">
        {row.getValue("totalPrice")} ETH
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Status"
        className="text-xs"
      />
    ),
    cell: ({ row }) => (
      <div className="text-xs cursor-pointer">
        {row.getValue("status") === ListingStatus.LIVE ? (
          <span className="text-blue-400 text-semibold">Live</span>
        ) : row.getValue("status") === ListingStatus.BOUGHT ? (
          <span className="text-muted-foreground">Bought</span>
        ) : (
          "Sold"
        )}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
