"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table/data-table-column-header";
import {
  AssetListing,
  ListingFillType,
  ListingType,
} from "@/models/asset-listing.model";
import clsx from "clsx";

export const AssetListingColumns: ColumnDef<AssetListing>[] = [
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
      return <div className="text-xs">{row.getValue("amount")}</div>;
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
        <div className={clsx("text-xs")}>
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
      <div className="text-xs">
        {row.getValue("fillType") === ListingFillType.FULL ? "Full" : "Partial"}
      </div>
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
      <div className="text-xs">{row.getValue("totalPrice")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
